/* ASCIIsvg.js
Ver 1.2.7 Oct 13, 2005 (c) Peter Jipsen http://www.chapman.edu/~jipsen
Modified for IMathas by David Lippman */
function chop(n,t){return t==null&&(t=0),Math.floor(n*Math.pow(10,t))/Math.pow(10,t)}function ran(n,t,i){return i==null&&(i=0),chop((t+Math.pow(10,-i)-n)*Math.random()+n,i)}function myCreateElementXHTML(n){return isOldIE?document.createElement(n):document.createElementNS("http://www.w3.org/1999/xhtml",n)}function isSVGavailable(){var rv,oSVG;if((ver=navigator.userAgent.toLowerCase().match(/webkit\/(\d+)/))!=null&&ver[1]>531)return null;if(navigator.product&&navigator.product=="Gecko")return rv=navigator.userAgent.toLowerCase().match(/rv:\s*([\d\.]+)/),rv!=null&&(rv=rv[1].split("."),rv.length<3&&(rv[2]=0),rv.length<2&&(rv[1]=0)),rv!=null&&1e4*rv[0]+100*rv[1]+1*rv[2]>=10800?null:1;if(navigator.appName.slice(0,9)=="Microsoft"){if(version=parseFloat(navigator.appVersion.split("MSIE")[1]),version>=9)return null;try{return oSVG=eval("new ActiveXObject('Adobe.SVGCtl.3');"),null}catch(e){return 1}}else return 1}function less(n,t){return n<t}function setText(n,t){var i=document.getElementById(t);i!=null&&(i.childNodes.length!=0?i.childNodes[0].nodeValue=n:i.appendChild(document.createTextNode(n)))}function myCreateElementSVG(n){return isOldIE?doc.createElement(n):doc.createElementNS("http://www.w3.org/2000/svg",n)}function getX(){return(doc.getElementById("pointerpos").getAttribute("cx")-origin[0])/xunitlength}function getY(){return(height-origin[1]-doc.getElementById("pointerpos").getAttribute("cy"))/yunitlength}function mousemove_listener(n){svgpicture.getAttribute("xbase")!=null&&(pointerpos.cx.baseVal.value=n.clientX-svgpicture.getAttribute("xbase")),svgpicture.getAttribute("ybase")!=null&&(pointerpos.cy.baseVal.value=n.clientY-svgpicture.getAttribute("ybase"))}function top_listener(n){svgpicture.setAttribute("ybase",n.clientY)}function bottom_listener(n){svgpicture.setAttribute("ybase",n.clientY-height+1)}function left_listener(n){svgpicture.setAttribute("xbase",n.clientX)}function right_listener(n){svgpicture.setAttribute("xbase",n.clientX-width+1)}function switchTo(n){picture=document.getElementById(n),width=picture.getAttribute("width")-0,height=picture.getAttribute("height")-0,strokewidth="1",stroke="black",fill="none",marker="none",(picture.nodeName=="EMBED"||picture.nodeName=="embed")&&isOldIE?(svgpicture=picture.getSVGDocument().getElementById("root"),doc=picture.getSVGDocument()):(picture.setAttribute("onmousemove","updateCoords"+(n.slice(n.length-1)-1)+"()"),svgpicture=picture,doc=document),xunitlength=svgpicture.getAttribute("xunitlength")-0,yunitlength=svgpicture.getAttribute("yunitlength")-0,xmin=svgpicture.getAttribute("xmin")-0,xmax=svgpicture.getAttribute("xmax")-0,ymin=svgpicture.getAttribute("ymin")-0,ymax=svgpicture.getAttribute("ymax")-0,origin=[svgpicture.getAttribute("ox")-0,svgpicture.getAttribute("oy")-0]}function updatePicture(n){var src=document.getElementById(typeof n=="string"?n:"picture"+(n+1)+"input").value;xmin=null,xmax=null,ymin=null,ymax=null,xscl=null,xgrid=null,yscl=null,ygrid=null,initialized=!1,switchTo(typeof n=="string"?n.slice(0,8):"picture"+(n+1)),src=src.replace(/plot\(\x20*([^\"f\[][^\n\r]+?)\,/g,'plot("$1",'),src=src.replace(/plot\(\x20*([^\"f\[][^\n\r]+)\)/g,'plot("$1")'),src=src.replace(/([0-9])([a-zA-Z])/g,"$1*$2"),src=src.replace(/\)([\(0-9a-zA-Z])/g,")*$1");try{with(Math)eval(src)}catch(t){alert(t+"\n"+src)}}function showHideCode(n){for(var t=n.nextSibling;t!=null&&t.nodeName!="BUTTON"&&t.nodeName!="button";)t=t.nextSibling;for(t.style.display=t.style.display=="none"?"":"none";t!=null&&t.nodeName!="TEXTAREA"&&t.nodeName!="textarea";)t=t.previousSibling;t.style.display=t.style.display=="none"?"":"none"}function hideCode(){}function showcode(){}function nobutton(){}function setBorder(n,t,i,r){border=r==null?[n,n,n,n]:[n,t,i,r]}function initPicture(x_min,x_max,y_min,y_max){var qnode,node,st;if(!initialized)if(strokewidth="1",strokedasharray=null,stroke="black",fill="none",fontstyle="italic",fontfamily="times",fontsize="16",fontweight="normal",fontstroke="black",fontfill="black",fontbackground="none",marker="none",initialized=!0,x_min!=null&&(xmin=x_min),x_max!=null&&(xmax=x_max),y_min!=null&&(ymin=y_min),y_max!=null&&(ymax=y_max),xmin==null&&(xmin=-5),xmax==null&&(xmax=5),typeof xmin!="number"||typeof xmax!="number"||xmin>=xmax)alert("Picture requires at least two numbers: xmin < xmax");else if(y_max!=null&&(typeof y_min!="number"||typeof y_max!="number"||y_min>=y_max))alert("initPicture(xmin,xmax,ymin,ymax) requires numbers ymin < ymax");else{if(width=picture.getAttribute("width"),(width==null||width=="")&&(width=defaultwidth),height=picture.getAttribute("height"),(height==null||height=="")&&(height=defaultheight),xunitlength=(width-border[0]-border[2])/(xmax-xmin),yunitlength=xunitlength,ymin==null?(origin=[-xmin*xunitlength+border[0],height/2],ymin=-(height-border[1]-border[3])/(2*yunitlength),ymax=-ymin):(ymax!=null?yunitlength=(height-border[1]-border[3])/(ymax-ymin):ymax=(height-border[1]-border[3])/yunitlength+ymin,origin=[-xmin*xunitlength+border[0],-ymin*yunitlength+border[1]]),winxmin=Math.max(border[0]-5,0),winxmax=Math.min(width-border[2]+5,width),winymin=Math.max(border[3]-5,0),winymax=Math.min(height-border[1]+5,height),isOldIE){for(svgpicture=picture.getSVGDocument().getElementById("root");svgpicture.childNodes.length()>5;)svgpicture.removeChild(svgpicture.lastChild);svgpicture.setAttribute("width",width),svgpicture.setAttribute("height",height),doc=picture.getSVGDocument()}else qnode=document.createElementNS("http://www.w3.org/2000/svg","svg"),qnode.setAttribute("id",picture.getAttribute("id")),qnode.setAttribute("style","display:inline; "+picture.getAttribute("style")),qnode.setAttribute("width",picture.getAttribute("width")),qnode.setAttribute("height",picture.getAttribute("height")),picture.parentNode!=null?picture.parentNode.replaceChild(qnode,picture):svgpicture.parentNode.replaceChild(qnode,svgpicture),svgpicture=qnode,doc=document,pointerpos=doc.getElementById("pointerpos"),pointerpos==null&&(pointerpos=myCreateElementSVG("circle"),pointerpos.setAttribute("id","pointerpos"),pointerpos.setAttribute("cx",0),pointerpos.setAttribute("cy",0),pointerpos.setAttribute("r",.5),pointerpos.setAttribute("fill","red"),svgpicture.appendChild(pointerpos));svgpicture.setAttribute("xunitlength",xunitlength),svgpicture.setAttribute("yunitlength",yunitlength),svgpicture.setAttribute("xmin",xmin),svgpicture.setAttribute("xmax",xmax),svgpicture.setAttribute("ymin",ymin),svgpicture.setAttribute("ymax",ymax),svgpicture.setAttribute("ox",origin[0]),svgpicture.setAttribute("oy",origin[1]),node=myCreateElementSVG("rect"),node.setAttribute("x","0"),node.setAttribute("y","0"),node.setAttribute("width",width),node.setAttribute("height",height),node.setAttribute("style","stroke-width:1;fill:white"),svgpicture.appendChild(node),isOldIE||picture.getAttribute("onmousemove")==null||(svgpicture.addEventListener("mousemove",mousemove_listener,!0),st=picture.getAttribute("onmousemove"),svgpicture.addEventListener("mousemove",eval(st.slice(0,st.indexOf("("))),!0),node=myCreateElementSVG("polyline"),node.setAttribute("points","0,0 "+width+",0"),node.setAttribute("style","stroke:white; stroke-width:3"),node.addEventListener("mousemove",top_listener,!0),svgpicture.appendChild(node),node=myCreateElementSVG("polyline"),node.setAttribute("points","0,"+height+" "+width+","+height),node.setAttribute("style","stroke:white; stroke-width:3"),node.addEventListener("mousemove",bottom_listener,!0),svgpicture.appendChild(node),node=myCreateElementSVG("polyline"),node.setAttribute("points","0,0 0,"+height),node.setAttribute("style","stroke:white; stroke-width:3"),node.addEventListener("mousemove",left_listener,!0),svgpicture.appendChild(node),node=myCreateElementSVG("polyline"),node.setAttribute("points",width-1+",0 "+(width-1)+","+height),node.setAttribute("style","stroke:white; stroke-width:3"),node.addEventListener("mousemove",right_listener,!0),svgpicture.appendChild(node)),border=defaultborder}}function line(n,t,i){var r;i!=null&&(r=doc.getElementById(i)),r==null&&(r=myCreateElementSVG("path"),r.setAttribute("id",i),svgpicture.appendChild(r)),r.setAttribute("d","M"+(n[0]*xunitlength+origin[0])+","+(height-n[1]*yunitlength-origin[1])+" "+(t[0]*xunitlength+origin[0])+","+(height-t[1]*yunitlength-origin[1])),r.setAttribute("stroke-width",strokewidth),strokedasharray!=null&&r.setAttribute("stroke-dasharray",strokedasharray),r.setAttribute("stroke",stroke),fill.substr(0,5)=="trans"?(r.setAttribute("fill",fill.substring(5)),r.setAttribute("fill-opacity",fillopacity)):r.setAttribute("fill",fill),marker=="dot"||marker=="arrowdot"?(ASdot(n,4,markerstroke,markerfill),marker=="arrowdot"&&arrowhead(n,t),ASdot(t,4,markerstroke,markerfill)):marker=="arrow"&&arrowhead(n,t)}function path(n,t,i){i==null&&(i="");var r,f,u;if(t!=null&&(r=doc.getElementById(t)),r==null&&(r=myCreateElementSVG("path"),r.setAttribute("id",t),svgpicture.appendChild(r)),typeof n=="string")f=n;else for(f="M",f+=n[0][0]*xunitlength+origin[0]+","+(height-n[0][1]*yunitlength-origin[1])+" "+i,u=1;u<n.length;u++)f+=n[u][0]*xunitlength+origin[0]+","+(height-n[u][1]*yunitlength-origin[1])+" ";if(r.setAttribute("d",f),r.setAttribute("stroke-width",strokewidth),strokedasharray!=null&&r.setAttribute("stroke-dasharray",strokedasharray),r.setAttribute("stroke",stroke),fill.substr(0,5)=="trans"?(r.setAttribute("fill",fill.substring(5)),r.setAttribute("fill-opacity",fillopacity)):r.setAttribute("fill",fill),marker=="dot"||marker=="arrowdot")for(u=0;u<n.length;u++)(i!="C"&&i!="T"||u!=1&&u!=2)&&ASdot(n[u],4,markerstroke,markerfill)}function curve(n,t){path(n,t,"T")}function circle(n,t,i){var r;i!=null&&(r=doc.getElementById(i)),r==null&&(r=myCreateElementSVG("circle"),r.setAttribute("id",i),svgpicture.appendChild(r)),r.setAttribute("cx",n[0]*xunitlength+origin[0]),r.setAttribute("cy",height-n[1]*yunitlength-origin[1]),r.setAttribute("r",t*xunitlength),r.setAttribute("stroke-width",strokewidth),r.setAttribute("stroke",stroke),fill.substr(0,5)=="trans"?(r.setAttribute("fill",fill.substring(5)),r.setAttribute("fill-opacity",fillopacity)):r.setAttribute("fill",fill)}function loop(n,t,i){t==null&&(t=[1,0]),path([n,[n[0]+t[0],n[1]+t[1]],[n[0]-t[1],n[1]+t[0]],n],i,"C"),(marker=="arrow"||marker=="arrowdot")&&arrowhead([n[0]+Math.cos(1.4)*t[0]-Math.sin(1.4)*t[1],n[1]+Math.sin(1.4)*t[0]+Math.cos(1.4)*t[1]],n)}function sector(n,t,i,r,u){var f,l,e,o;u!=null&&(f=doc.getElementById(u)),f==null&&(f=myCreateElementSVG("path"),f.setAttribute("id",u),svgpicture.appendChild(f)),e=0,Math.abs(r-i)>3.142&&(e=1),o=0,r<i&&(o=1);var s=[n[0]+t*Math.cos(i),n[1]+t*Math.sin(i)],h=[n[0]+t*Math.cos(r),n[1]+t*Math.sin(r)],c="M"+(n[0]*xunitlength+origin[0])+","+(height-n[1]*yunitlength-origin[1])+" L"+(s[0]*xunitlength+origin[0])+","+(height-s[1]*yunitlength-origin[1])+" A"+t*xunitlength+","+t*yunitlength+" 0 "+e+","+o+" "+(h[0]*xunitlength+origin[0])+","+(height-h[1]*yunitlength-origin[1])+" z";f.setAttribute("d",c),f.setAttribute("stroke-width",strokewidth),f.setAttribute("stroke",stroke),fill.substr(0,5)=="trans"?(f.setAttribute("fill",fill.substring(5)),f.setAttribute("fill-opacity",fillopacity)):f.setAttribute("fill",fill)}function arc(n,t,i,r){var e,f;r!=null&&(e=doc.getElementById(r)),i==null&&(f=[t[0]-n[0],t[1]-n[1]],i=Math.sqrt(f[0]*f[0]+f[1]*f[1])),e==null&&(e=myCreateElementSVG("path"),e.setAttribute("id",r),svgpicture.appendChild(e)),e.setAttribute("d","M"+(n[0]*xunitlength+origin[0])+","+(height-n[1]*yunitlength-origin[1])+" A"+i*xunitlength+","+i*yunitlength+" 0 0,0 "+(t[0]*xunitlength+origin[0])+","+(height-t[1]*yunitlength-origin[1])),e.setAttribute("stroke-width",strokewidth),e.setAttribute("stroke",stroke),fill.substr(0,5)=="trans"?(e.setAttribute("fill",fill.substring(5)),e.setAttribute("fill-opacity",fillopacity)):e.setAttribute("fill",fill),marker=="arrow"||marker=="arrowdot"?(u=[(t[1]-n[1])/4,(n[0]-t[0])/4],f=[(t[0]-n[0])/2,(t[1]-n[1])/2],f=[n[0]+f[0]+u[0],n[1]+f[1]+u[1]]):f=[n[0],n[1]],marker=="dot"||marker=="arrowdot"?(ASdot(n,4,markerstroke,markerfill),marker=="arrowdot"&&arrowhead(f,t),ASdot(t,4,markerstroke,markerfill)):marker=="arrow"&&arrowhead(f,t)}function ellipse(n,t,i,r){var u;r!=null&&(u=doc.getElementById(r)),u==null&&(u=myCreateElementSVG("ellipse"),u.setAttribute("id",r),svgpicture.appendChild(u)),u.setAttribute("cx",n[0]*xunitlength+origin[0]),u.setAttribute("cy",height-n[1]*yunitlength-origin[1]),u.setAttribute("rx",t*xunitlength),u.setAttribute("ry",i*yunitlength),u.setAttribute("stroke-width",strokewidth),u.setAttribute("stroke",stroke),fill.substr(0,5)=="trans"?(u.setAttribute("fill",fill.substring(5)),u.setAttribute("fill-opacity",fillopacity)):u.setAttribute("fill",fill)}function rect(n,t,i,r,u){var f;i!=null&&(f=doc.getElementById(i)),f==null&&(f=myCreateElementSVG("rect"),f.setAttribute("id",i),svgpicture.appendChild(f)),f.setAttribute("x",Math.min(n[0],t[0])*xunitlength+origin[0]),f.setAttribute("y",height-Math.max(t[1],n[1])*yunitlength-origin[1]),f.setAttribute("width",Math.abs(t[0]-n[0])*xunitlength),f.setAttribute("height",Math.abs(t[1]-n[1])*yunitlength),r!=null&&f.setAttribute("rx",r*xunitlength),u!=null&&f.setAttribute("ry",u*yunitlength),f.setAttribute("stroke-width",strokewidth),f.setAttribute("stroke",stroke),fill.substr(0,5)=="trans"?(f.setAttribute("fill",fill.substring(5)),f.setAttribute("fill-opacity",fillopacity)):f.setAttribute("fill",fill)}function text(n,t,i,r){n[0]=n[0]*xunitlength+origin[0],n[1]=n[1]*yunitlength+origin[1],textabs(n,t,i,r)}function textabs(n,t,i,r,u,f){var o,s,e,l,h;r=r==null?0:(360-r)%360;var c="middle",o=0,s=0;if(r==270&&(s=0,o=fontsize/3,i!=null&&(i.match(/left/)&&(o=-fontsize/2-2),i.match(/right/)&&(o=1*fontsize+2),i.match(/above/)&&(c="start",s=-fontsize/2-2),i.match(/below/)&&(c="end",s=fontsize/2+2))),r==90&&(s=0,o=-fontsize/3,i!=null&&(i.match(/left/)&&(o=-fontsize-2),i.match(/right/)&&(o=fontsize/2+2),i.match(/above/)&&(c="end",s=-fontsize/2-2),i.match(/below/)&&(c="start",s=fontsize/2+2))),r==0&&(o=0,s=fontsize/3,i!=null&&(i.match(/above/)&&(s=-fontsize/3-2),i.match(/below/)&&(s=1*fontsize+2),i.match(/right/)&&(c="start",o=fontsize/3+2),i.match(/left/)&&(c="end",o=-fontsize/3-2))),u!=null&&(e=doc.getElementById(u)),e==null&&(e=myCreateElementSVG("text"),e.setAttribute("id",u),svgpicture.appendChild(e),e.appendChild(doc.createTextNode(t))),e.lastChild.nodeValue=t,e.setAttribute("x",n[0]+o),e.setAttribute("y",height-n[1]+s),r!=0&&e.setAttribute("transform","rotate("+r+" "+(n[0]+o)+" "+(height-n[1]+s)+")"),e.setAttribute("font-style",f!=null?f:fontstyle),e.setAttribute("font-family",fontfamily),e.setAttribute("font-size",fontsize),e.setAttribute("font-weight",fontweight),e.setAttribute("text-anchor",c),fontfill!="none"&&e.setAttribute("fill",fontfill),e.setAttribute("stroke-width","0px"),fontbackground!="none")try{l=e.getBBox(),h=myCreateElementSVG("rect"),h.setAttribute("fill",fontbackground),h.setAttribute("stroke-width","0px"),h.setAttribute("x",l.x-2),h.setAttribute("y",l.y-1),h.setAttribute("width",l.width+4),h.setAttribute("height",l.height+2),r!=0&&h.setAttribute("transform","rotate("+r+" "+(n[0]+o)+" "+(height-n[1]+s)+")"),svgpicture.insertBefore(h,e)}catch(a){}return n}function ASdot(n,t,i,r){i==null&&(i=stroke),r==null&&(r=fill);var u=myCreateElementSVG("circle");u.setAttribute("cx",n[0]*xunitlength+origin[0]),u.setAttribute("cy",height-n[1]*yunitlength-origin[1]),u.setAttribute("r",t),u.setAttribute("stroke-width",strokewidth),u.setAttribute("stroke",i),u.setAttribute("fill",r),svgpicture.appendChild(u)}function dot(n,t,i,r,u){var f,e=n[0]*xunitlength+origin[0],o=height-n[1]*yunitlength-origin[1];u!=null&&(f=doc.getElementById(u)),t=="+"||t=="-"||t=="|"?(f==null&&(f=myCreateElementSVG("path"),f.setAttribute("id",u),svgpicture.appendChild(f)),t=="+"?(f.setAttribute("d"," M "+(e-ticklength)+" "+o+" L "+(e+ticklength)+" "+o+" M "+e+" "+(o-ticklength)+" L "+e+" "+(o+ticklength)),f.setAttribute("stroke-width",.5),f.setAttribute("stroke",axesstroke)):(t=="-"?f.setAttribute("d"," M "+(e-ticklength)+" "+o+" L "+(e+ticklength)+" "+o):f.setAttribute("d"," M "+e+" "+(o-ticklength)+" L "+e+" "+(o+ticklength)),f.setAttribute("stroke-width",strokewidth),f.setAttribute("stroke",stroke))):(f==null&&(f=myCreateElementSVG("circle"),f.setAttribute("id",u),svgpicture.appendChild(f)),f.setAttribute("cx",e),f.setAttribute("cy",o),f.setAttribute("r",dotradius),f.setAttribute("stroke-width",strokewidth),f.setAttribute("stroke",stroke),f.setAttribute("fill",t=="open"?"white":stroke)),i!=null&&text(n,i,r==null?"below":r,u==null?u:u+"label")}function arrowhead(n,t){var f,o=[n[0]*xunitlength+origin[0],height-n[1]*yunitlength-origin[1]],r=[t[0]*xunitlength+origin[0],height-t[1]*yunitlength-origin[1]],i=[r[0]-o[0],r[1]-o[1]],e=Math.sqrt(i[0]*i[0]+i[1]*i[1]),u;e>1e-8&&(i=[i[0]/e,i[1]/e],f=[-i[1],i[0]],u=myCreateElementSVG("path"),u.setAttribute("d","M "+(r[0]-15*i[0]-4*f[0])+" "+(r[1]-15*i[1]-4*f[1])+" L "+(r[0]-3*i[0])+" "+(r[1]-3*i[1])+" L "+(r[0]-15*i[0]+4*f[0])+" "+(r[1]-15*i[1]+4*f[1])+" z"),u.setAttribute("stroke-width",markerstrokewidth),u.setAttribute("stroke",stroke),u.setAttribute("fill",stroke),svgpicture.appendChild(u))}function chopZ(n){var i=n.indexOf("."),t;if(i==-1)return n;for(t=n.length-1;t>i&&n.charAt(t)=="0";t--);return t==i&&t--,n.slice(0,t+1)}function grid(n,t){axes(n,t,null,n,t)}function noaxes(){initialized||initPicture()}function axes(dx,dy,n,t,i,dox,doy,r){var x,y,ldx,ldy,lx,ly,lxp,lyp,f,u,ddx,ddy;if(initialized||initPicture(),typeof dx=="string"&&(n=dx,dx=null),typeof dy=="string"&&(t=dy,dy=null),xscl!=null&&(dx=xscl,t=xscl,n=dx),yscl!=null&&(dy=yscl,i=yscl),xtick!=null&&(dx=xtick),ytick!=null&&(dy=ytick),dox==null&&(dox=!0),doy==null&&(doy=!0),dox=dox=="off"||dox==0?!1:!0,doy=doy=="off"||doy==0?!1:!0,t!=null&&t>0&&(xmax-xmin)/t>width&&(t=xmax-xmin),i!=null&&i>0&&(ymax-ymin)/i>height&&(i=ymax-ymin),(xmax-xmin)/dx>width&&(dx=xmax-xmin),(ymax-ymin)/dy>height&&(dy=ymax-ymin),dx=dx==null?xunitlength:dx*xunitlength,dy=dy==null?dx:dy*yunitlength,fontsize=Math.floor(Math.min(dx/1.5,dy/1.5,16)),ticklength=fontsize/4,xgrid!=null&&(t=xgrid),ygrid!=null&&(i=ygrid),t!=null&&t>0){if(r!=null&&r==1)var e=origin[1]+.7*ticklength,o=origin[1]-.7*ticklength,s=origin[0]-.7*ticklength,h=origin[0]+.7*ticklength;else var e=winymin,o=winymax,s=winxmin,h=winxmax;if(t=typeof t=="string"?dx:t*xunitlength,i=i==null?dy:i*yunitlength,f=myCreateElementSVG("path"),u="",dox&&t>0){for(x=origin[0];x<=winxmax;x=x+t)x>=winxmin&&(u+=" M"+x+","+e+" "+x+","+o);for(x=origin[0]-t;x>=winxmin;x=x-t)x<=winxmax&&(u+=" M"+x+","+e+" "+x+","+o)}if(doy&&i>0){for(y=height-origin[1];y<=winymax;y=y+i)y>=winymin&&(u+=" M"+s+","+y+" "+h+","+y);for(y=height-origin[1]-i;y>=winymin;y=y-i)y<=winymax&&(u+=" M"+s+","+y+" "+h+","+y)}f.setAttribute("d",u),f.setAttribute("stroke-width",.5),f.setAttribute("stroke",gridstroke),f.setAttribute("fill",fill),svgpicture.appendChild(f)}if(f=myCreateElementSVG("path"),dox&&(u="M"+winxmin+","+(height-origin[1])+" "+winxmax+","+(height-origin[1])),doy&&(u+=" M"+origin[0]+","+winymin+" "+origin[0]+","+winymax),dox){for(x=origin[0];x<winxmax;x=x+dx)x>=winymin&&(u+=" M"+x+","+(height-origin[1]+ticklength)+" "+x+","+(height-origin[1]-ticklength));for(x=origin[0]-dx;x>winxmin;x=x-dx)x<=winxmax&&(u+=" M"+x+","+(height-origin[1]+ticklength)+" "+x+","+(height-origin[1]-ticklength))}if(doy){for(y=height-origin[1];y<winymax;y=y+dy)y>=winymin&&(u+=" M"+(origin[0]+ticklength)+","+y+" "+(origin[0]-ticklength)+","+y);for(y=height-origin[1]-dy;y>winymin;y=y-dy)y<=winymax&&(u+=" M"+(origin[0]+ticklength)+","+y+" "+(origin[0]-ticklength)+","+y)}if(n!=null)with(Math){if(ldx=dx/xunitlength,ldy=dy/yunitlength,lx=xmin>0||xmax<0?xmin:0,ly=ymin>0||ymax<0?ymin:0,lxp=ly==0?"below":"above",lyp=lx==0?"left":"right",ddx=floor(1.1-log(ldx)/log(10))+1,ddy=floor(1.1-log(ldy)/log(10))+1,ddy<0&&(ddy=0),ddx<0&&(ddx=0),dox){for(x=doy?ldx:0;x<=xmax;x=x+ldx)x>=xmin&&text([x,ly],chopZ(x.toFixed(ddx)),lxp);for(x=-ldx;xmin<=x;x=x-ldx)x<=xmax&&text([x,ly],chopZ(x.toFixed(ddx)),lxp)}if(doy){for(y=dox?ldy:0;y<=ymax;y=y+ldy)y>=ymin&&text([lx,y],chopZ(y.toFixed(ddy)),lyp);for(y=-ldy;ymin<=y;y=y-ldy)y<=ymax&&text([lx,y],chopZ(y.toFixed(ddy)),lyp)}}f.setAttribute("d",u),f.setAttribute("stroke-width",.5),f.setAttribute("stroke",axesstroke),f.setAttribute("fill",fill),svgpicture.appendChild(f)}function slopefield(fun,dx,dy){var g=fun,gxy,x,y,u,v,dz,x_min,y_min;for(typeof fun=="string"&&eval("g = function(x,y){ with(Math) return "+mathjs(fun)+" }"),dx==null&&(dx=1),dy==null&&(dy=1),dz=Math.sqrt(dx*dx+dy*dy)/6,x_min=Math.ceil(xmin/dx),y_min=Math.ceil(ymin/dy),x=x_min;x<=xmax;x+=dx)for(y=y_min;y<=ymax;y+=dy)gxy=g(x,y),isNaN(gxy)||(Math.abs(gxy)=="Infinity"?(u=0,v=dz):(u=dz/Math.sqrt(1+gxy*gxy),v=gxy*u),line([x-u,y-v],[x+u,y+v]))}function drawPictures(){drawPics()}function parseShortScript(sscript,gw,gh){var sa,inx,eqnlist;if(sscript==null&&(initialized=!1,sscript=picture.sscr),sa=sscript.split(","),gw&&gh&&(sa[9]=gw,sa[10]=gh,sscript=sa.join(","),picture.setAttribute("sscr",sscript)),picture.setAttribute("width",sa[9]),picture.setAttribute("height",sa[10]),picture.style.width=sa[9]+"px",picture.style.height=sa[10]+"px",sa.length>10){for(commands="setBorder(5);",commands+="width="+sa[9]+"; height="+sa[10]+";",commands+="initPicture("+sa[0]+","+sa[1]+","+sa[2]+","+sa[3]+");",commands+="axes("+sa[4]+","+sa[5]+","+sa[6]+","+sa[7]+","+sa[8]+");",inx=11,eqnlist="Graphs: ";sa.length>inx+9;)commands+='stroke="'+sa[inx+7]+'";',commands+='strokewidth="'+sa[inx+8]+'";',sa[inx+9]!=""&&(commands+='strokedasharray="'+sa[inx+9].replace(/\s+/g,",")+'";'),sa[inx]=="slope"?(eqnlist+="dy/dx="+sa[inx+1]+"; ",commands+='slopefield("'+sa[inx+1]+'",'+sa[inx+2]+","+sa[inx+2]+");"):sa[inx]=="label"?(eqnlist+="label="+sa[inx+1]+"; ",commands+="text(["+sa[inx+5]+","+sa[inx+6]+'],"'+sa[inx+1]+'");'):(sa[inx]=="func"?(eqnlist+="y="+sa[inx+1]+"; ",eqn='"'+sa[inx+1]+'"'):sa[inx]=="polar"?(eqnlist+="r="+sa[inx+1]+"; ",eqn='["cos(t)*('+sa[inx+1]+')","sin(t)*('+sa[inx+1]+')"]'):sa[inx]=="param"&&(eqnlist+="[x,y]=["+sa[inx+1]+","+sa[inx+2]+"]; ",eqn='["'+sa[inx+1]+'","'+sa[inx+2]+'"]'),commands+=typeof eval(sa[inx+5])=="number"?"plot("+eqn+","+sa[inx+5]+","+sa[inx+6]+",null,null,"+sa[inx+3]+","+sa[inx+4]+");":"plot("+eqn+",null,null,null,null,"+sa[inx+3]+","+sa[inx+4]+");"),inx+=10;try{eval(commands)}catch(e){setTimeout(function(){parseShortScript(sscript,gw,gh)},100)}return picture.setAttribute("alt",eqnlist),commands}}function drawPics(){var i,f,t,u,r;if(pictures=document.getElementsByTagName("embed"),!ASnoSVG&&isOldIE)try{for(t=0;t<pictures.length;t++)if((pictures[t].getAttribute("sscr")!=""||pictures[t].getAttribute("script")!="")&&pictures[t].getSVGDocument().getElementById("root")==null){setTimeout(drawPics,100);return}}catch(e){setTimeout(drawPics,100);return}for(u=pictures.length,i=0;i<u;i++)if(picture=!ASnoSVG&&isOldIE?pictures[i]:pictures[0],ASnoSVG)picture.getAttribute("sscr")!=""&&(n=document.createElement("img"),n.setAttribute("style",picture.getAttribute("style")),n.setAttribute("src",AScgiloc+"?sscr="+encodeURIComponent(picture.getAttribute("sscr"))),pn=picture.parentNode,pn.replaceChild(n,picture));else if(initialized=!1,r=picture.getAttribute("sscr"),r!=null&&r!="")try{parseShortScript(r)}catch(e){}else if(src=picture.getAttribute("script"),src!=null&&src!="")try{with(Math)eval(src)}catch(o){alert(o+"\n"+src)}}function plot(fun,x_min,x_max,points,id,min_type,max_type){var pth=[],f=function(n){return n},g=fun,name=null,min,max,inc,gt,t;if(typeof fun=="string"?eval("g = function(x){ with(Math) return "+mathjs(fun)+" }"):typeof fun=="object"&&(eval("f = function(t){ with(Math) return "+mathjs(fun[0])+" }"),eval("g = function(t){ with(Math) return "+mathjs(fun[1])+" }")),typeof x_min=="string"?(name=x_min,x_min=xmin):name=id,min=x_min==null?xmin:x_min,max=x_max==null?xmax:x_max,max<=min)return null;for(inc=max-min-1e-6*(max-min),inc=points==null?inc/200:inc/points,t=min;t<=max;t+=inc)gt=g(t),isNaN(gt)||Math.abs(gt)=="Infinity"||(pth.length>0&&Math.abs(gt-pth[pth.length-1][1])>ymax-ymin?(pth.length>1&&path(pth,name),pth.length=0):pth[pth.length]=[f(t),gt]);return pth.length>1&&path(pth,name),min_type==1?arrowhead(pth[1],pth[0]):min_type==2?dot(pth[0],"open"):min_type==3&&dot(pth[0],"closed"),max_type==1?arrowhead(pth[pth.length-2],pth[pth.length-1]):max_type==2?dot(pth[pth.length-1],"open"):max_type==3&&dot(pth[pth.length-1],"closed"),p}function updateCoords(n){switchTo("picture"+(n+1));var t=getX(),i=getY();(xmax-t)*xunitlength>6*fontsize||(i-ymin)*yunitlength>2*fontsize?text([xmax,ymin],"("+t.toFixed(2)+", "+i.toFixed(2)+")","aboveleft","AScoord"+n,""):text([xmax,ymin]," ","aboveleft","AScoord"+n,"")}function updateCoords0(){updateCoords(0)}function updateCoords1(){updateCoords(1)}function updateCoords2(){updateCoords(2)}function updateCoords3(){updateCoords(3)}function updateCoords4(){updateCoords(4)}function updateCoords5(){updateCoords(5)}function updateCoords6(){updateCoords(6)}function updateCoords7(){updateCoords(7)}function updateCoords8(){updateCoords(8)}function updateCoords9(){updateCoords(9)}function generic(){drawPictures()}var ASnoSVG=!1,checkIfSVGavailable=!0,notifyIfNoSVG=!1,alertIfNoSVG=!1,xunitlength=20,yunitlength=20,origin=[0,0],defaultwidth=300,existing;defaultheight=200,defaultborder=[0,0,0,0];var border=defaultborder,strokewidth,strokedasharray,stroke,fill,fontstyle,fontfamily,fontsize,fontweight,fontstroke,fontfill,fontbackground,fillopacity=.5,markerstrokewidth="1",markerstroke="black",markerfill="yellow",marker="none",arrowfill=stroke,dotradius=4,ticklength=4,axesstroke="black",gridstroke="grey",pointerpos=null,coordinates=null,above="above",below="below",left="left",right="right",aboveleft="aboveleft",aboveright="aboveright",belowleft="belowleft",belowright="belowright",xmin,xmax,ymin,ymax,xscl,yscl,xgrid,ygrid,xtick,ytick,initialized,isOldIE=document.createElementNS==null,picture,svgpicture,doc,width,height,a,b,c,d,i,n,p,t,x,y;ASfn=[function(){updatePicture(0)},function(){updatePicture(1)},function(){updatePicture(2)},function(){updatePicture(3)},function(){updatePicture(4)},function(){updatePicture(5)},function(){updatePicture(6)},function(){updatePicture(7)},function(){updatePicture(8)},function(){updatePicture(9)}],ASupdateCoords=[function(){updateCoords(0)},function(){updateCoords(1)},function(){updateCoords(2)},function(){updateCoords(3)},function(){updateCoords(4)},function(){updateCoords(5)},function(){updateCoords(6)},function(){updateCoords(7)},function(){updateCoords(8)},function(){updateCoords(9)}],typeof window.addEventListener!="undefined"?window.addEventListener("load",generic,!1):typeof document.addEventListener!="undefined"?document.addEventListener("load",generic,!1):typeof window.attachEvent!="undefined"?window.attachEvent("onload",generic):typeof window.onload=="function"?(existing=onload,window.onload=function(){existing(),generic()}):window.onload=generic,checkIfSVGavailable&&(checkifSVGavailable=!1,nd=isSVGavailable(),ASnoSVG=nd!=null);
