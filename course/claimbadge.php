<?php
// localhost/imathas/course/claimbadge.php?cid=3942&badgid=4&userid=108534
require("../validate.php");

$curBreadcrumb = "$breadcrumbbase <a href=\"course.php?cid={$_GET['cid']}\">$coursename</a> ";

$placeinhead = '<script src="http://beta.openbadges.org/issuer.js"></script>';
require("../header.php");

echo "<div class=\"breadcrumb\">$curBreadcrumb &gt; Claim Badge</div>";

if (isset($teacherid)) {
	if (empty($_GET['userid'])) {
		echo 'Only students can claim a badge';
	} else {
		$userid = $_GET['userid'];
		$query = "SELECT SID FROM imas_users WHERE id='$userid'";
		$result = mysql_query($query) or die("Query failed : " . mysql_error());
		$username = mysql_result($result,0,0);
	}
} else if (!isset($studentid) && !isset($teacherid)) {
	echo 'Must be a student in this class to claim a badge';
	
} else if (!isset($_GET['badgeid'])) {
	echo 'No badge id provided';
//} else if (isset($teacherid) || isset($tutorid))  {
//	echo 'This page is only relevant to student.';
//} else if (!isset($studentid)) {
//	echo 'You are not authorized to view this page.';	
} else {
	$badgeid = intval($_GET['badgeid']);
	$query = "SELECT name, requirements FROM imas_badgesettings WHERE id=$badgeid AND courseid='$cid'";
	$result = mysql_query($query) or die("Query failed : " . mysql_error());
	if (mysql_num_rows($result)==0) {
		echo 'Invalid badge ID for this course';
	} else {
		list($name,$req) = mysql_fetch_row($result);
		$req = unserialize($req);
		
		//get student's scores
		require("gbtable2.php");
		$secfilter = -1;
		$gbt = gbtable($userid);
		
		
		$query = "SELECT id,name FROM imas_gbcats WHERE courseid='$cid' ORDER BY name";
		$result = mysql_query($query) or die("Query failed : " . mysql_error());
		$gtypes = array('0'=>'Past Due', '3'=>'Past and Attempted', '1'=>'Past and Available', '2'=>'All Items'); 
		
		while ($row=mysql_fetch_row($result)) {
			$gbcats[$row[0]] = $row[1];
		}
		
		$reqmet = true;
		echo '<h2>Badge: '.$name.'</h2>';
		echo '<p>Badge requirements:</p>';
		echo '<table class="gb"><thead><tr><th>Category/Course Total</th><th>Score Required</th><th>Your Score</th><th>Requirement Met</th></tr></thead><tbody>';
		foreach ($req['data'] as $r) {  //r = array(gbcat, gradetype, score)
			$metthis = false;
			echo '<tr><td>';
			if ($r[0]>0) {//is a category total
				echo $gbcats[$r[0]] . ' ('.$gtypes[$r[1]].')';
			} else {
				echo 'Course Total ('.$gtypes[$r[1]].')';
			}
			echo '</td><td>';
			echo $r[2].'%';
			echo '</td><td>';
			if ($r[0]>0) {//is a category total
				foreach ($gbt[0][2] as $i=>$catinfo) {
					if ($catinfo[10]==$r[0]) { //found category
						if ($r[1]==3) {
							$mypercent = round(100*$gbt[1][2][$i][3]/$gbt[1][2][$i][4],1);
						} else {
							if ($catinfo[$r[1]+3]==0) { 
								$mypercent= 0;
							} else {
								$mypercent = round(100*$gbt[1][2][$i][$r[1]]/$catinfo[$r[1]+3],1);
							}
						}
						echo $mypercent.'%';
						if ($mypercent>=$r[2]) {
							$metthis = true;
						}
					}
				}
			} else { //is a course total
				if ($r[1]==3) { //past and attempted
					if ($gbt[1][3][8]==null) {
						$mypercent = $gbt[1][3][6];
					} else {
						$mypercent = $gbt[1][3][8];
					}
				} else {
					if ($gbt[1][3][3+$r[1]]==null) {
						$mypercent = $gbt[1][3][$r[1]];
					} else {
						$mypercent = $gbt[1][3][3+$r[1]];
					}
				}
				echo $mypercent.'%';
				if ($mypercent>=$r[2]) {
					$metthis = true;
				}
			}
			echo '</td><td>';
			if ($metthis==true) {
				echo 'Yes!';
			} else {
				echo 'No';
				$reqmet = false;
			}
			echo '</td></tr>';
		}
		echo '</tbody></table>';
		
		if ($reqmet) {
			echo '<h3>Badge Requirements have been met!</h3>';
			$verify = urlencode(hash('sha256', $username . $userid));
			$url = $urlmode  . $_SERVER['HTTP_HOST'] . $imasroot . '/course/verifybadge.php?format=json&userid='.$userid.'&badgeid='.$badgeid.'&v='.$verify;
			
			echo '<p><input type="button" value="Claim Badge" onclick="OpenBadges.issue([\''.$url.'\'], function(errors,successes) { })"/><br/>FireFox, Chrome, Safari, or IE 9+ is needed to claim badge.</p>';
		}
	}
	
}
require("../footer.php");

?>
