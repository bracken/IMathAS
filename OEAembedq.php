<?php
//IMathAS:  Embed a Question via iFrame
//(c) 2010 David Lippman

require("./config.php");
require("i18n/i18n.php");
require("includes/JWT.php");
header('P3P: CP="ALL CUR ADM OUR"');

if((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']=='on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO']=='https'))  {
 	 $urlmode = 'https://';
 } else {
 	 $urlmode = 'http://';
 }

require("./assessment/displayq2.php");

$sessiondata = array();
$sessiondata['graphdisp'] = 1;
$sessiondata['mathdisp'] = 3;
$showtips = 2;
$useeqnhelper = 4;
$placeinhead = "<link rel=\"stylesheet\" href=\"$imasroot/assessment/mathquill.css?v=102113\" type=\"text/css\" />";
if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE')!==false) {
	$placeinhead .= '<!--[if lte IE 7]><style style="text/css">
		.mathquill-editable.empty { width: 0.5em; }
		.mathquill-rendered-math .numerator.empty, .mathquill-rendered-math .empty { padding: 0 0.25em;}
		.mathquill-rendered-math sup { line-height: .8em; }
		.mathquill-rendered-math .numerator {float: left; padding: 0;}
		.mathquill-rendered-math .denominator { clear: both;width: auto;float: left;}
		</style><![endif]-->';
}
$placeinhead .= "<script type=\"text/javascript\" src=\"$imasroot/javascript/mathquill_min.js?v=102113\"></script>";
$placeinhead .= "<script type=\"text/javascript\" src=\"$imasroot/javascript/mathquilled.js?v=070214\"></script>";
$placeinhead .= "<script type=\"text/javascript\" src=\"$imasroot/javascript/AMtoMQ.js?v=102113\"></script>";
$placeinhead .= '<style type="text/css"> html,body {margin:0px;} div.question input.btn { margin-left: 10px; } </style>';
$placeinhead .= "<script type=\"text/javascript\" src=\"$imasroot/javascript/eqntips.js?v=032810\"></script>";

$issigned = false;
if (isset($_GET['jwt'])) {
	try {
		$QS = JWT::decode($_GET['jwt']);
	} catch (Exception $e) {
	         echo "JWT Error: ".$e->getMessage();
	         exit;
	}
	$issigned = true;
} else {
	$QS = $_GET;
}
if (isset($QS['jssubmit']) && $QS['jssubmit']==0) {
	$jssubmit = false;
} else {
	$jssubmit = true;
}

if (empty($QS['id'])) {
	echo 'Need to supply an id';
	exit;
}

$qsetid=intval($QS['id']);

$sessiondata['coursetheme'] = $coursetheme;

$page_formAction = "OEAembedq.php?id=$qsetid";

$showans = false;

$flexwidth = true; //tells header to use non _fw stylesheet
$placeinhead .= '<style type="text/css">div.question {width: auto;} div.review {width: auto; margin-top: 5px;} body {height:auto;}</style>';
$useeditor = 1;
require("./assessment/header.php");

//seeds 1-4999 are for summative requests that are signed
//seeds 5000-9999 are for formative requests (unsigned)

if (isset($QS['showscored'])) {
	//DE is requesting that the question be redisplayed with right/wrong markers
	
	$lastanswers = array();
	list($seed, $rawscores, $lastanswers[0]) = explode(';', $QS['showscored'], 3);
	$rawscores = explode('~',$rawscores);
	$seed = intval($seed);
	
	$showans = (($issigned || $seed>4999)  && (!isset($QS['showans']) || $QS['showans']=='true'));
	
	
	displayq(0, $qsetid, $seed, $showans?2:0, true, 0,false,false,false,$rawscores);
		
} else if (isset($_POST['seed'])) {
	//time to score the question
	$seed = intval($_POST['seed']);
	$scoredonsubmit = false;
	if (isset($_POST['auth'])) {
		$query = "SELECT password FROM imas_users WHERE SID='{$_POST['auth']}'";
		$result = mysql_query($query) or die("Query failed: $query: " . mysql_error());
		$row = mysql_fetch_row($result);
		$key = $row[0];
		$params["auth"] = stripslashes($_POST['auth']);
		$jwtcheck = JWT::decode($_POST['jwtchk'], $key);
		if ($jwtcheck['id'] != $qsetid || $jwtcheck['seed'] != $seed) {
			echo "ID/Seed did not check";
			exit;
		} else if ($seed>4999) {
			echo "Seed invalid";
			exit;
		}
		$scoredonsubmit = $jwtcheck['scoredonsubmit'];
	} else {
		$key = '';
		if ($seed<5000) {
			echo "Seed invalid";
			exit;
		}
		$scoredonsubmit = isset($_POST['showscoredonsubmit']);
	}
	
	$lastanswers = array();

	list($score,$rawscores) = scoreq(0,$qsetid,$seed,$_POST['qn0'],1);
	if (strpos($score,'~')===false) {
		$after = round($score,1);
		if ($after < 0) { $after = 0;}
	} else {
		$fparts = explode('~',$score);
		$after = array();
		foreach ($fparts as $k=>$fpart) {
			$after[$k] = round($fpart,2);
			if ($after[$k]<0) {$after[$k]=0;}
		}
		$after = implode('~',$after);
	}
	if (strpos($rawscores,'~')===false) {
		$rawafter = round($scores,1);
		if ($rawafter < 0) { $rawafter = 0;}
	} else {
		$fparts = explode('~',$rawscores);
		$rawafter = array();
		foreach ($fparts as $k=>$fpart) {
			$rawafter[$k] = round($fpart,2);
			if ($rawafter[$k]<0) {$rawafter[$k]=0;}
		}
		$rawafter = implode('~',$rawafter);
	}
	$lastanswers[0] = stripslashes($lastanswers[0]);
	
	$pts = getpts($after);
	
	$params = array('id'=>$qsetid, 'score'=>$pts, 'redisplay'=>"$seed;$rawafter;{$lastanswers[0]}");
		
	$signed = JWT::encode($params, $key);
	
	echo '<script type="text/javascript">
	$(function() {
		window.parent.postMessage("updatescore='.$signed.'","*");
	});
	</script>';
	if ($scoredonsubmit) {
		$rawscores = explode('~',$rawafter);
		
		$showans = (($issigned || $seed>4999)  && (!isset($QS['showans']) || $QS['showans']=='true'));
		
		displayq(0, $qsetid, $seed, $showans?2:0, true, 0,false,false,false,$rawscores);
	} else {
		echo '<p>Saving score... <img src="img/updating.gif"/></p>';
	}
	
} else {
	$lastanswers = array();
	if (isset($QS['redisplay'])) {
		//DE is requesting that the question be redisplayed
		list($seed, $rawscores, $lastanswers[0]) = explode(';', $QS['redisplay'],3);
		$rawscores = array();
	} else {
		if (isset($QS['auth'])) { //is signed
			$seed = rand(1,4999);
		} else {
			$seed = rand(5000,9999);
		}
	}
	$doshowans = 0;
	echo "<form id=\"qform\" method=\"post\" enctype=\"multipart/form-data\" action=\"$page_formAction\" onsubmit=\"doonsubmit()\">\n";
	echo "<input type=\"hidden\" name=\"seed\" value=\"$seed\" />";
	$scoredonsubmit = false;
	if (isset($QS['showscoredonsubmit'])) {
		echo '<input type="hidden" name="showscoredonsubmit" value="1"/>';
		$scoredonsubmit = true;
	}
	if (isset($QS['auth'])) {
		$verarr = array("id"=>$qsetid, "seed"=>$seed, 'scoredonsubmit'=>$scoredonsubmit);
		$query = "SELECT password FROM imas_users WHERE SID='".addslashes(stripslashes($QS['auth']))."'";
		$result = mysql_query($query) or die("Query failed: $query: " . mysql_error());
		$row = mysql_fetch_row($result);
		$key = $row[0];
		echo '<input type="hidden" name="jwtchk" value="'.JWT::encode($verarr,$key).'"/>';
		echo '<input type="hidden" name="auth" value="'.$QS['auth'].'"/>';
	}
	if (isset($QS['showhints']) && $QS['showhints']==0) {
		$showhints = false;	
	} else {
		$showhints = true;
	}
		
	displayq(0, $qsetid, $seed, $doshowans, $showhints, 0);
	if ($jssubmit) {
		echo '<input type="submit" id="submitbutton" style="display:none;"/>';
		echo '<script type="text/javascript">
		$(function() {
			$(window).on("message", function(e) {
				var data = e.originalEvent.data;
				if (data=="submit") {
					$("#submitbutton").click();
				}});
		});
		</script>';
	} else {
		echo "<input type=submit name=\"check\" value=\"" . _('Submit') . "\">\n";
	}
	echo "</form>\n";
	
}

echo '<script type="text/javascript">
	if (MathJax) {
		MathJax.Hub.Queue(function () {
			var height = document.body.scrollHeight;
			window.parent.postMessage("action=resize&id='.$qsetid.'&height="+height,"*");
		});
	} else {
		$(function() {
			var height = document.body.scrollHeight;
			window.parent.postMessage("action=resize&id='.$qsetid.'&height="+height,"*");
		});
	}
	</script>';
require("./footer.php");


function getansweights($code,$seed) {
	$foundweights = false;
	if (($p = strpos($code,'answeights'))!==false || strpos($code,'anstypes')===false) {
		$p = strpos($code,"\n",$p);
		$weights = sandboxgetweights($code,$seed);
		if (is_array($weights)) {
			return $weights;
		}
		
	} 
	if (!$foundweights) {
		preg_match('/anstypes\s*=(.*)/',$code,$match);
		$n = substr_count($match[1],',')+1;
		if ($n>1) {
			$weights = array_fill(0,$n-1,round(1/$n,3));
			$weights[] = 1-array_sum($weights);
			return $weights;
		} else {
			return array(1);
		}
	}
}

function sandboxgetweights($code,$seed) {
	srand($seed);
	eval(interpret('control','multipart',$code));
	if (!isset($answeights)) {
		return false;
	} else if (is_array($answeights)) {
		return $answeights;
	} else {
		return explode(',',$answeights);
	}
}

function printscore($sc,$qsetid,$seed) {
	$poss = 1;
	if (strpos($sc,'~')===false) {
		$sc = str_replace('-1','N/A',$sc);
		$out = sprintf(_('%1$s out of %2$s'), $sc, $poss);
		$pts = $sc;
		if (!is_numeric($pts)) { $pts = 0;}
	} else {
		$query = "SELECT control FROM imas_questionset WHERE id='$qsetid'";
		$result = mysql_query($query) or die("Query failed: $query: " . mysql_error());
		$control = mysql_result($result,0,0);
		$ptposs = getansweights($control,$seed);
		for ($i=0; $i<count($ptposs)-1; $i++) {
			$ptposs[$i] = round($ptposs[$i]*$poss,2);
		}
		//adjust for rounding
		$diff = $poss - array_sum($ptposs);
		$ptposs[count($ptposs)-1] += $diff;
		
		
		$pts = getpts($sc);
		$sc = str_replace('-1','N/A',$sc);
		//$sc = str_replace('~',', ',$sc);
		$scarr = explode('~',$sc);
		foreach ($scarr as $k=>$v) {
			if ($ptposs[$k]==0) {
				$pm = 'gchk';
			} else if (!is_numeric($v) || $v==0) { 
				$pm = 'redx';
			} else if (abs($v-$ptposs[$k])<.011) {
				$pm = 'gchk';
			} else {
				$pm = 'ychk';
			}
			$bar = "<img src=\"$imasroot/img/$pm.gif\" />";
			$scarr[$k] = "$bar $v/{$ptposs[$k]}";
		}
		$sc = implode(', ',$scarr);
		//$ptposs = implode(', ',$ptposs); 
		$out = sprintf(_('%1$s out of %2$s (parts: %3$s)'), $pts, $poss, $sc);
	}	
	$bar = '<span class="scorebarholder">';
	if ($poss==0) {
		$w = 30;
	} else {
		$w = round(30*$pts/$poss);
	}
	if ($w==0) {$w=1;}
	if ($w < 15) { 
	     $color = "#f".dechex(floor(16*($w)/15))."0";
	} else if ($w==15) {
	     $color = '#ff0';
	} else { 
	     $color = "#". dechex(floor(16*(2-$w/15))) . "f0";
	}
	
	$bar .= '<span class="scorebarinner" style="background-color:'.$color.';width:'.$w.'px;">&nbsp;</span></span> ';
	return $bar . $out;	
}

function getpts($sc) {
	if (strpos($sc,'~')===false) {
		if ($sc>0) {
			return $sc;
		} else {
			return 0;
		}
	} else {
		$sc = explode('~',$sc);
		$tot = 0;
		foreach ($sc as $s) {
			if ($s>0) { 
				$tot+=$s;
			}
		}
		return round($tot,1);
	}
}


?>
