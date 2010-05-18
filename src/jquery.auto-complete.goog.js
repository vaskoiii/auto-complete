/*
 * Auto Complete [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 
(function(h,R,j){function L(e,p){if(L.flag!==g){L.flag=g;W.bind("click.autoComplete",function(u){i.getFocus(g).trigger("autoComplete.document-click",[u])})}e=e.closest("form");var k,B;if(e.length<1)return e;k=h.data(e[0],"ac-inputs")||{};k[p]=g;h.data(e[0],"ac-inputs",k);if(h.data(e[0],"autoComplete")!==g){h.data(e[0],"autoComplete",g);e.bind("submit.autoComplete",function(u){return(B=i.getFocus(g)).length?B.triggerHandler("autoComplete.form-submit",[u,this]):g})}}function ha(e,p){i.remove(p);if(L.flag===
g&&i.length===0){L.flag=o;W.unbind("click.autoComplete")}e=e.closest("form");var k,B;if(!(e.length<1)){k=e.data("ac-inputs")||{};k[p]=o;for(B in k)if(k.hasOwnProperty(B)&&k[B]===g)return;e.unbind("submit.autoComplete")}}function $(e,p){if(!h.isArray(p.supply))return[];e=-1;for(var k=p.supply.length,B=[],u;++e<k;){u=(u=p.supply[e])&&u.value?u:{value:u};B.push(u)}return B}function aa(){return this}h.fn.autoComplete=function(){var e=ba.call(arguments),p=this,k=e.shift(),B=typeof k=="string",u,M;e=i.arrayMethods[k]===
g&&h.isArray(e[0])&&h.isArray(e[0][0])||e.length===1&&h.isArray(e[0])?e[0]:e;u=B&&(i.handlerMethods[k]===-1||e.length<(i.handlerMethods[k]||0))?"triggerHandler":"trigger";return B?p[u]("autoComplete."+k,e):k&&k.preventDefault!==j?p.trigger(k,e):h.each(p,function(){if(h.data(M=this,"autoComplete")!==g)h.autoComplete(M,k)})};var g=true,o=false,ba=Array.prototype.slice,ca=R.document,W=h(ca),da=h(),ia=R.opera||/macintosh/i.test(R.navigator.userAgent)&&h.browser.mozilla?"keypress.autoComplete":"keydown.autoComplete",
w="autoComplete_"+h.expando,z={backspace:8,tab:9,enter:13,shift:16,space:32,pageup:33,pagedown:34,left:37,up:38,right:39,down:40},i={version:"[VERSION]",expando:w,counter:0,length:0,stack:{},jqStack:{},order:[],hasFocus:o,keys:z,arrayMethods:{"button-supply":g,"direct-supply":g},handlerMethods:{option:2},focus:j,blur:j,getFocus:function(e){return!i.order[0]?e?da:j:e?i.jqStack[i.order[0]]:i.stack[i.order[0]]},getPrevious:function(e){for(var p=0,k=i.order.length;++p<k;)if(i.order[p])return e?i.jqStack[i.order[p]]:
i.stack[i.order[p]];return e?da:j},remove:function(e){for(var p=-1,k=i.order.length;++p<k;)if(i.order[p]===e)i.order[p]=j;i.length--;delete i.stack[e]},getAll:function(){for(var e=-1,p=i.counter,k=[];++e<p;)i.stack[e]&&k.push(i.stack[e]);return h(k)},defaults:{ajax:"ajax.php",ajaxCache:h.ajaxSettings.cache,dataSupply:[],dataFn:j,formatSupply:j,list:"auto-complete-list",rollover:"auto-complete-list-rollover",width:j,striped:j,maxHeight:j,bgiframe:j,newList:o,postVar:"value",postData:{},postFormat:j,
minChars:1,maxItems:-1,maxRequests:0,maxRequestsDeep:o,requestType:"POST",onChange:j,autoFill:o,nonInput:[z.shift,z.left,z.right],multiple:o,multipleSeparator:" ",onBlur:j,onFocus:j,onHide:j,onLoad:j,onMaxRequest:j,onRollover:j,onSelect:j,onShow:j,onListFormat:j,onSubmit:j,spinner:j,preventEnterSubmit:g,delay:0,useCache:g,cacheLimit:50}};h.autoComplete=function(e,p){function k(b,a,d,l,C){if(a.maxRequestsDeep===g&&S>=a.maxRequests)return o;a.spinner&&a.spinner.call(e,b,{active:g,settings:a,cache:d,
ul:f});if(T)T=clearTimeout(T);if(a.delay>0&&C===j)return T=R.setTimeout(function(){k(b,a,d,l,g)},a.delay);U&&U.abort();if(a.useCache&&h.isArray(d.list[d.val]))return V(b,d.list[d.val],a,d,l);if(a.dataSupply.length)return B(b,a,d,l);if(a.maxRequests&&++S>=a.maxRequests){f.html("").hide(b);a.spinner&&a.spinner.call(e,b,{active:o,settings:a,cache:d,ul:f});if(a.onMaxRequest&&S===a.maxRequests)return a.onMaxRequest.call(e,b,{search:d.val,val:x,settings:a,cache:d,ul:f});return o}a.postData[a.postVar]=d.val;
return U=h.ajax({type:a.requestType,url:a.ajax,cache:a.ajaxCache,dataType:"json",data:a.postFormat?a.postFormat.call(e,b,{data:a.postData,search:d.val,val:x,settings:a,cache:d,ul:f}):a.postData,success:function(E){V(b,E,a,d,l)},error:function(){f.html("").hide(b);a.spinner&&a.spinner.call(e,b,{active:o,settings:a,cache:d,ul:f})}})}function B(b,a,d,l){var C=[],E={},N=h.isFunction(a.dataFn),J=N?j:new RegExp("^"+d.val,"i"),O=0,G,X=-1,ja=a.dataSupply.length;if(a.formatSupply)C=a.formatSupply.call(e,b,
{search:d.val,supply:a.dataSupply,settings:a,cache:d,ul:f});else for(;++X<ja;){G=(G=a.dataSupply[X])&&typeof G.value=="string"?G:{value:G};E={search:d.val,entry:G.value,list:C,i:X,supply:a.dataSupply,settings:a,cache:d,ul:f};if(N&&a.dataFn.call(e,b,E)||!N&&G.value.match(J)){if(a.maxItems>-1&&++O>a.maxItems)break;C.push(G)}}return V(b,C,a,d,l)}function u(b){if(v){c.onSelect&&c.onSelect.call(e,b,{data:y,li:r,settings:c,cache:m,ul:f});P();x=s.val();if(n.type==="keydown")n["enter_"+w]=g;f.hide(b)}r=j}
function M(b){r&&r.removeClass(c.rollover);f.show(b);r=F.eq(q).addClass(c.rollover);y=D[q];if(!r.length||!y)return o;P(y.value);c.onRollover&&c.onRollover.call(e,b,{data:y,li:r,settings:c,cache:m,ul:f});b=q*K;if(b<I-Q){I=b+Q;f.scrollTop(b)}}function ea(b){r&&r.removeClass(c.rollover);f.show(b);r=F.eq(q).addClass(c.rollover);y=D[q];if(!r.length||!y)return o;P(y.value);var a=(q+1)*K;if(a>I)f.scrollTop((I=a)-Q);c.onRollover&&c.onRollover.call(e,b,{data:y,li:r,settings:c,cache:m,ul:f})}function fa(){if(!c.newList&&
!f)f=c.list.jquery?c.list:c.list.nodeName?h(c.list):typeof c.list=="string"&&(ga=W.find("ul."+c.list).eq(0)).length?Y.call(ga,c.bgiframe):j;f||(f=Y.call(h("<ul/>").appendTo("body").addClass(c.list).hide().data("ac-selfmade",g),c.bgiframe));var b=f.hide,a=f.show,d=h.data(f[0],"ac-inputs")||{};if(!f[w]){f.hide=function(l,C,E){c.onHide&&v&&c.onHide.call(e,l,{ul:f,settings:c,cache:m});v=o;return b.call(f,C,E)};f.show=function(l,C,E){c.onShow&&!v&&c.onShow.call(e,l,{ul:f,settings:c,cache:m});v=g;return a.call(f,
C,E)};f[w]=g}if(h.data(f[0],"autoComplete")!==g){h.data(f[0],"autoComplete",g);f.delegate("li","mouseenter.autoComplete",function(l){i.getFocus(g).trigger("autoComplete.ul-mouseenter",[l,this])}).bind("click.autoComplete",function(l){i.getFocus(g).trigger("autoComplete.ul-click",[l]);return o})}d[A]=g;h.data(f[0],"ac-inputs",d);return f}function P(b){var a,d,l;if(b===j||b==="")a=d=s.val().length;else{if(H)b=x.substr(0,x.length-x.split(H).pop().length)+b+H;a=x.length;d=b.length;s.val(b)}if(!c.autoFill||
a>d)return o;else if(e.createTextRange){l=e.createTextRange();if(b===j)l.move("character",a);else{l.collapse(g);l.moveStart("character",a);l.moveEnd("character",d)}l.select()}else if(e.setSelectionRange)e.setSelectionRange(a,d);else if(e.selectionStart){e.selectionStart=a;e.selectionEnd=d}}function V(b,a,d,l,C){D=d.onLoad?d.onLoad.call(e,b,{list:a,settings:d,cache:l,ul:f}):a;d.spinner&&d.spinner.call(e,b,{active:o,settings:d,cache:l,ul:f});if(d.useCache&&!h.isArray(l.list[l.val])){l.length++;l.list[l.val]=
a;if(d.cacheLimit!==-1&&l.length>d.cacheLimit){l.list={};l.length=0}}if(!D||D.length<1)return f.html("").hide(b);q=-1;a=s.offset();var E=[],N=0,J=-1,O=o,G=D.length;if(d.onListFormat)d.onListFormat.call(e,b,{list:D,settings:d,cache:l,ul:f});else{for(;++J<G;)if(D[J].value){if(d.maxItems>-1&&++N>d.maxItems)break;E.push(d.striped&&O?'<li class="'+d.striped+'">':"<li>",D[J].display||D[J].value,"</li>");O=!O}f.html(E.join(""))}F=f.children("li");h.data(f[0],"ac-input-index",A);if(d.autoFill&&!C){q=0;y=
D[0];P(y.value);r=F.eq(0).addClass(d.rollover)}f.scrollTop(0).css({top:a.top+s.outerHeight(),left:a.left,width:d.width}).show(b);K=F.eq(0).outerHeight();if(d.maxHeight)f.css({height:K*F.length>d.maxHeight?d.maxHeight:"auto",overflow:"auto"});I=Q=f.outerHeight();Z=K===0?0:Math.floor(I/K);n.timeStamp=(new Date).getTime()}i.length++;i.counter++;var s=h(e).attr("autocomplete","off"),f,ga,t={},n={},x="",D=[],F={length:0},r,I,Q,K,Z,v=o,T,U,q=-1,y,H,A=i.counter,S=0,Y=h.fn.bgiframe||h.fn.bgIframe||aa,m={length:0,
val:j,list:{}},c=h.extend({width:s.outerWidth()},i.defaults,p||{},h.metadata?s.metadata():{});h.data(e,"autoComplete",t={index:A,hasFocus:o,active:g,settings:c,initialSettings:h.extend(g,{},c)});ca.attachEvent&&s.bind("keypress.autoComplete",function(b){if(!t.active)return g;if(b.keyCode===z.enter){var a=g;if(r&&r.hasClass(c.rollover)){a=c.preventEnterSubmit&&v?o:g;u(b)}else v&&f.hide(b);return a}});s.bind(ia,function(b){if(!t.active)return g;var a=(n=b).keyCode,d=o;if(a===z.tab&&v)u(b);else if(a===
z.enter){d=g;if(r&&r.hasClass(c.rollover)){d=c.preventEnterSubmit&&v?o:g;u(b)}else v&&f.hide(b)}else if(a===z.up&&v)if(q>0){q--;M(b)}else{q=-1;s.val(x);f.hide(b)}else if(a===z.down&&v){if(q<F.length-1){q++;ea(b)}}else if(a===z.pageup&&v){if(q>0){q-=Z;if(q<0)q=0;M(b)}}else if(a===z.pagedown&&v){if(q<F.length-1){q+=Z;if(q>F.length-1)q=F.length-1;ea(b)}}else if(c.nonInput&&h.inArray(a,c.nonInput)>-1){f.html("").hide(b);d=g}else return g;n["keydown_"+w]=g;return d}).bind({"keyup.autoComplete":function(b){if(!t.active||
n["keydown_"+w])return g;x=s.val();var a=(n=b).keyCode,d=H?x.split(H).pop():x;if(a!=z.enter){m.val=c.onChange===j?d:c.onChange.call(e,b,{val:d,key:a,settings:c,cache:m,ul:f});if(m.val.length>=c.minChars)k(b,c,m,a===z.backspace||a===z.space);else a==z.backspace&&f.html("").hide(b)}},"blur.autoComplete":function(b){if(!t.active||v)return g;i.order[0]!==j&&i.order.unshift(j);i.hasFocus=o;t.hasFocus=o;q=-1;f.hide(n=b);i.blur&&i.blur.call(e,b,{settings:c,cache:m,ul:f});c.onBlur&&c.onBlur.call(e,b,{val:x,
settings:c,cache:m,ul:f})},"focus.autoComplete":function(b,a){if(!t.active||t.hasFocus&&a===w||n["enter_"+w])return g;A!==h.data(f[0],"ac-input-index")&&f.html("").hide(b);if(i.order[0]===j)if(i.order[1]===A)i.order.shift();else i.order[0]=A;else i.order[0]!=A&&i.order[1]!=A&&i.order.unshift(A);i.defaults.cacheLimit!==-1&&i.order.length>i.defaults.cacheLimit&&i.order.pop();i.hasFocus=g;t.hasFocus=g;n=b;i.focus&&i.focus.call(e,b,{settings:c,cache:m,ul:f});c.onFocus&&c.onFocus.call(e,b,{settings:c,
cache:m,ul:f})},"autoComplete.document-click":function(b,a){if(t.active&&v&&(!n||a.timeStamp-n.timeStamp>200)&&h.data(h(a.target).closest("ul")[0],"ac-input-index")!==A){f.hide(n=a);s.trigger("blur")}},"autoComplete.form-submit":function(b,a,d){if(!t.active)return g;n=a;return c.preventEnterSubmit&&(v||n["enter_"+w])?o:c.onSubmit===j?g:c.onSubmit.call(e,a,{form:d,settings:c,cache:m,ul:f})},"autoComplete.ul-mouseenter":function(b,a,d){r&&r.removeClass(c.rollover);r=h(d).addClass(c.rollover);q=F.index(d);
y=D[q];I=f.scrollTop()+Q;n=a;c.onRollover&&c.onRollover.call(e,a,{data:y,li:r,settings:c,cache:m,ul:f})},"autoComplete.ul-click":function(b,a){s.trigger("focus",[w]);s.val(x===H?x.substr(0,x.length-x.split(H).pop().length)+y.value+H:y.value);f.hide(n=a);P();c.onSelect&&c.onSelect.call(e,a,{data:y,li:r,settings:c,cache:m,ul:f})},"autoComplete.settings":function(b,a){if(!t.active)return g;n=b;if(h.isFunction(a)){b=a.call(e,b,{settings:c,cache:m,ul:f});if(h.isArray(b)&&b[0]!==j){h.extend(g,c,b[0]||c);
h.extend(g,m,b[1]||m)}}else h.extend(g,c,a||{});Y=h.fn.bgiframe||h.fn.bgIframe||aa;f=fa();c.requestType=c.requestType.toUpperCase();if(c.inputControl!==j&&c.onChange===j)c.onChange=c.inputControl;H=c.multiple?c.multipleSeparator:j;t.settings=c},"autoComplete.flush":function(b,a){if(!t.active)return g;a||(S=0);m={length:0,val:j,list:{}};n=b},"autoComplete.button-ajax":function(b,a,d){if(!t.active)return g;if(typeof a=="string"){d=a;a={}}n=b;s.trigger("focus",[w]);m.val=d||"button-ajax_"+w;return k(b,
h.extend(g,{},c,{maxItems:-1,postData:a||{}}),m)},"autoComplete.button-supply":function(b,a,d){if(!t.active)return g;if(typeof a=="string"){d=a;a=j}n=b;s.trigger("focus",[w]);m.val=d||"button-supply_"+w;a=h.isArray(a)?a:c.dataSupply;return k(b,h.extend(g,{},c,{maxItems:-1,dataSupply:a,formatSupply:$}),m)},"autoComplete.direct-supply":function(b,a,d){if(!t.active)return g;if(typeof a=="string"){d=a;a=j}n=b;s.trigger("focus",[w]);m.val=d||"direct-supply_"+w;a=h.isArray(a)&&a.length?a:c.dataSupply;return V(b,
a,h.extend(g,{},c,{maxItems:-1,dataSupply:a,formatSupply:$}),m)},"autoComplete.search":function(b,a){if(!t.active)return g;m.val=a||"";return k(n=b,c,m)},"autoComplete.option":function(b,a,d){if(!t.active)return g;n=b;switch(ba.call(arguments).length){case 3:return c[a]=d;case 2:return a==="ul"?f:a==="cache"?m:a==="xhr"?U:a==="input"?s:c[a]||j;default:return c}},"autoComplete.enable":function(b){t.active=g;n=b},"autoComplete.disable":function(b){t.active=o;f.html("").hide(n=b)},"autoComplete.destroy":function(b){b=
h.data(f.html("").hide(n=b)[0],"ac-inputs")||{};var a;s.removeData("autoComplete").unbind(".autoComplete autoComplete");ha(s,A);b[A]=j;for(a in b)if(b.hasOwnProperty(a)&&b[a]===g)return n;h.data(f[0],"ac-selfmade")===g?f.remove():f.removeData("autoComplete").removeData("ac-input-index").removeData("ac-inputs")}});f=fa();c.requestType=c.requestType.toUpperCase();if(c.inputControl!==j&&c.onChange===j)c.onChange=c.inputControl;H=c.multiple?c.multipleSeparator:j;i.stack[A]=e;i.jqStack[A]=s;L(s,A)};i=
h.extend(h.autoComplete,i)})(jQuery,this);
