/*
 * Auto Complete [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */
(function(h,T,i){function L(){if(L.flag!==true){L.flag=true;W.bind("click.autoComplete",function(f){h(j.getFocus()).trigger("autoComplete.document-click",[f])})}}function ba(){if(L.flag===true&&j.length===0){L.flag=false;W.unbind("click.autoComplete")}}h.fn.autoComplete=function(){var f=X.call(arguments),x=this,q=f.shift(),P=typeof q==="string";if(P)q=q.replace(".","-");f=q==="button-supply"||q==="direct-supply"?h.isArray(f[0])&&h.isArray(f[0][0])?f[0]:f:f[1]===i&&h.isArray(f[0])?f[0]:f;return P?
x[q==="option"&&f.length<2?"triggerHandler":"trigger"]("autoComplete."+q,f):q&&q[h.expando]?x.trigger(q,f):x.each(function(){ca(this,q)})};h.fn.bgiframe=h.fn.bgiframe?h.fn.bgiframe:h.fn.bgIframe?h.fn.bgIframe:function(){return this};var g=true,r=false,X=Array.prototype.slice,W=h(T.document),w="autoComplete_"+h.expando,E={backspace:8,tab:9,enter:13,space:32,pageup:33,pagedown:34,up:38,down:40},j=h.autoComplete={version:"[VERSION]",counter:0,length:0,stack:{},order:[],hasFocus:r,getFocus:function(){return j.order[0]?
j.stack[j.order[0]]:i},getPrevious:function(){for(var f=0,x=j.order.length;++f<x;)if(j.order[f])return j.stack[j.order[f]];return i},remove:function(f){for(var x=-1,q=j.order.length;++x<q;)if(j.order[x]===f)j.order[x]=i;j.stack[f]=i;j.length--;delete j.stack[f]},getAll:function(){for(var f=-1,x=j.counter,q=[];++f<x;)j.stack[f]&&q.push(j.stack[f]);return h(q)},defaults:{backwardsCompatible:r,ajax:"ajax.php",ajaxCache:h.ajaxSettings.cache,dataSupply:[],dataFn:i,formatSupply:i,list:"auto-complete-list",
rollover:"auto-complete-list-rollover",width:i,striped:i,maxHeight:i,newList:r,postVar:"value",postData:{},postFormat:i,minChars:1,maxItems:-1,maxRequests:0,requestType:"POST",inputControl:i,autoFill:r,nonInput:i,multiple:r,multipleSeparator:" ",onBlur:i,onFocus:i,onHide:i,onLoad:i,onMaxRequest:i,onRollover:i,onSelect:i,onShow:i,onSubmit:function(){return g},spinner:i,onListFormat:i,preventEnterSubmit:g,delay:0,useCache:g,cacheLimit:50}},ca=function(f,x){function q(b,a,c,k,y){a.spinner&&a.spinner.call(f,
b,{active:g,settings:a,cache:c,ul:e});if(H)H=clearTimeout(H);if(a.delay>0&&y===i)return H=T.setTimeout(function(){q(b,a,c,k,g);H=clearTimeout(H)},a.delay);Q&&Q.abort();if(a.useCache&&c.list[c.val])return R(b,c.list[c.val],a,c,k);if(a.dataSupply.length)return P(b,a,c,k);if(a.maxRequests&&++U>=a.maxRequests){e.html("").hide(b);a.spinner&&a.spinner.call(f,b,{active:r,settings:a,cache:c,ul:e});if(a.onMaxRequest&&U===a.maxRequests)return a.onMaxRequest.apply(f,a.backwardsCompatible?[c.val,e,b,t,a,c]:[b,
{search:c.val,val:t,settings:a,cache:c,ul:e}]);return r}a.postData[a.postVar]=c.val;return Q=h.ajax({type:a.requestType,url:a.ajax,cache:a.ajaxCache,dataType:"json",data:a.postFormat?a.postFormat.call(f,b,{data:a.postData,search:c.val,val:t,settings:a,cache:c,ul:e}):a.postData,success:function(B){R(b,B,a,c,k)},error:function(){e.html("").hide(b);a.spinner&&a.spinner.call(f,b,{active:r,settings:a,cache:c,ul:e})}})}function P(b,a,c,k){var y=[],B=[],M=h.isFunction(a.dataFn),I=M?i:new RegExp("^"+c.val,
"i"),N=0,z,C=-1,da=a.dataSupply.length;if(a.formatSupply)y=a.formatSupply.call(f,b,{search:c.val,supply:a.dataSupply,settings:a,cache:c,ul:e});else for(;++C<da;){z=a.dataSupply[C];z=typeof z==="object"&&z.value?z:{value:z};B=a.backwardsCompatible?[c.val,z.value,y,C,a.dataSupply,e,b,a,c]:[b,{search:c.val,entry:z.value,list:y,i:C,supply:a.dataSupply,settings:a,cache:c,ul:e}];if(M&&a.dataFn.apply(f,B)||!M&&z.value.match(I)){if(a.maxItems>-1&&++N>a.maxItems)break;y.push(z)}}return R(b,y,a,c,k)}function Y(b){if(F){if(d.onSelect)d.onSelect.apply(f,
d.backwardsCompatible?[s,m,e,b,d,l]:[b,{data:s,li:m,settings:d,cache:l,ul:e}]);O();t=p.val();if(n.type==="keydown")n["enter_"+w]=g}e.hide(b);return m}function Z(b){m&&m.removeClass(d.rollover);e.show(b);m=D.eq(o).addClass(d.rollover);s=A[o];if(!m.length||!s)return r;O(s.value);if(d.onRollover)d.onRollover.apply(f,d.backwardsCompatible?[s,m,e,b,d,l]:[b,{data:s,li:m,settings:d,cache:l,ul:e}]);b=o*J;if(b<K-S){K=b+S;e.scrollTop(b)}return m}function $(b){m&&m.removeClass(d.rollover);e.show(b);m=D.eq(o).addClass(d.rollover);
s=A[o];if(!m.length||!s)return r;O(s.value);var a=(o+1)*J;if(a>K)e.scrollTop((K=a)-S);if(d.onRollover)d.onRollover.apply(f,d.backwardsCompatible?[s,m,e,b,d,l]:[b,{data:s,li:m,settings:d,cache:l,ul:e}]);return m}function aa(){var b=e.hide,a=e.show,c=e.data("ac-inputs")||{};if(!e[w]){e.hide=function(k,y,B){d.onHide&&F&&d.onHide.call(f,k,{ul:e,settings:d,cache:l});F=r;return b.call(e,y,B)};e.show=function(k,y,B){d.onShow&&!F&&d.onShow.call(f,k,{ul:e,settings:d,cache:l});F=g;return a.call(e,y,B)};e[w]=
g}c[u]=g;return e.data("ac-inputs",c)}function O(b){var a,c,k;if(b===i||b==="")a=c=p.val().length;else{if(G)b=t.substr(0,t.length-t.split(G).pop().length)+b+G;a=t.length;c=b.length;p.val(b)}if(!d.autoFill||a>c)return r;else if(f.createTextRange){k=f.createTextRange();if(b===i)k.move("character",a);else{k.collapse(g);k.moveStart("character",a);k.moveEnd("character",c)}k.select()}else if(f.setSelectionRange)f.setSelectionRange(a,c);else if(f.selectionStart){f.selectionStart=a;f.selectionEnd=c}return g}
function R(b,a,c,k,y){A=c.onLoad?c.onLoad.call(f,b,{list:a,settings:c,cache:k,ul:e}):a;c.spinner&&c.spinner.call(f,b,{active:r,settings:c,cache:k,ul:e});if(c.useCache&&k.list[k.val]===i){k.length++;k.list[k.val]=a;if(k.length>c.cacheLimit){k.list={};k.length=0}}if(!A||A.length<1)return e.html("").hide(b);o=-1;a=p.offset();var B=[],M=0,I=-1,N=r,z=A.length;if(c.onListFormat)c.onListFormat.call(f,b,{list:A,settings:c,cache:k,ul:e});else{for(;++I<z;)if(A[I].value){if(c.maxItems>-1&&++M>c.maxItems)break;
B.push(c.striped&&N?'<li class="'+c.striped+'">':"<li>",A[I].display||A[I].value,"</li>");N=!N}e.html(B.join(""))}D=e.children("li");if(c.autoFill&&!y){o=0;s=A[0];O(s.value);m=D.eq(0).addClass(c.rollover)}e.unbind(".autoComplete").data("ac-input-index",u).delegate("li","mouseleave.autoComplete",function(){m&&m.removeClass(c.rollover)}).delegate("li","mouseenter.autoComplete",function(C){m=h(this).addClass(c.rollover);o=D.index(m[0]);s=A[o];if(c.onRollover)c.onRollover.apply(f,c.backwardsCompatible?
[s,m,e,C,c,k]:[C,{data:s,li:m,settings:c,cache:k,ul:e}])}).bind("click.autoComplete",function(C){p.trigger("focus",[w]);p.val(t===G?t.substr(0,t.length-t.split(G).pop().length)+s.value+G:s.value);e.hide(C);O();if(c.onSelect)c.onSelect.apply(f,c.backwardsCompatible?[s,m,e,C,c,k]:[C,{data:s,li:m,settings:c,cache:k,ul:e}])}).css({top:a.top+p.outerHeight(),left:a.left,width:c.width}).scrollTop(0);J=D.eq(0).outerHeight();if(c.maxHeight)e.css({height:J*D.length>c.maxHeight?c.maxHeight:"auto",overflow:"auto"});
K=S=e.outerHeight();V=J===0?0:Math.floor(K/J);n.timeStamp=(new Date).getTime();return e.show(b)}j.length++;j.counter++;var p=h(f).attr("autocomplete","off"),v=g,n={},t="",A=[],D={length:0},m,K,S,J,V,F=r,H,Q,o=-1,s,G,u=j.counter,U=0,l={length:0,val:i,list:{}},d=h.extend({width:p.outerWidth()},j.defaults,x||{},h.metadata?p.metadata():{}),e=!d.newList&&h("ul."+d.list)[0]?h("ul."+d.list).eq(0).bgiframe().data("autoComplete",g):h("<ul/>").appendTo("body").addClass(d.list).bgiframe().hide().data({"ac-selfmade":g,
autoComplete:g});p.data({autoComplete:g,"ac-input-index":u,"ac-active":v,"ac-initial-settings":h.extend(g,{},d),"ac-settings":d}).bind(T.opera?"keypress.autoComplete":"keydown.autoComplete",function(b){if(!v)return g;var a=(n=b).keyCode,c=r;if(a===E.tab&&F)Y(b);else if(a===E.enter&&m){c=d.preventEnterSubmit&&F?r:g;Y(b)}else if(a===E.up)if(o>0){o--;Z(b)}else{o=-1;p.val(t);e.hide(b)}else if(a===E.down){if(o<D.length-1){o++;$(b)}}else if(a===E.pageup){if(o>0){o-=V;if(o<0)o=0;Z(b)}}else if(a===E.pagedown){if(o<
D.length-1){o+=V;if(o>D.length-1)o=D.length-1;$(b)}}else if(d.nonInput&&h.inArray(a,d.nonInput))e.html("").hide(b);else return g;n["keydown_"+w]=g;return c}).bind({"keyup.autoComplete":function(b){if(!v||n["keydown_"+w])return g;t=p.val();var a=(n=b).keyCode,c=G?t.split(G).pop():t;if(a!=E.enter){l.val=d.inputControl===i?c:d.inputControl.apply(f,d.backwardsCompatible?[c,a,e,b,d,l]:[b,{val:c,key:a,settings:d,cache:l,ul:e}]);if(l.val.length>=d.minChars)q(b,d,l,a===E.backspace||a===E.space);else a==E.backspace&&
e.html("").hide(b)}},"blur.autoComplete":function(b){if(!v||F)return g;n=b;p.data("ac-hasFocus",r);o=-1;j.order[0]!==i&&j.order.unshift(i);j.hasFocus=r;e.hide(b);if(d.onBlur)d.onBlur.apply(f,d.backwardsCompatible?[t,e,b,d,l]:[b,{val:t,settings:d,cache:l,ul:e}])},"focus.autoComplete":function(b,a){if(!v||j.focus===u&&a===w||n["enter_"+w])return g;n=b;u!=e.data("ac-input-index")&&e.html("").hide(b);if(j.order[0]===i)if(j.order[1]===u)j.order.shift();else j.order[0]=u;else j.order[0]!=u&&j.order[1]!=
u&&j.order.unshift(u);j.order.length>j.defaults.cacheLimit&&j.order.pop();j.hasFocus=g;p.data("ac-hasFocus",g);if(d.onFocus)d.onFocus.apply(f,d.backwardsCompatible?[e,b,d,l]:[b,{settings:d,cache:l,ul:e}])},"autoComplete.document-click":function(b,a){var c;if(v&&F&&(!n||a.timeStamp-n.timeStamp>200)&&(c=h(a.target)).closest("ul").data("ac-input-index")!==u&&c.data("ac-input-index")!==u){e.hide(a);n=a;p.blur()}},"autoComplete.settings":function(b,a){if(!v)return g;if(h.isFunction(a)){a=a.apply(f,d.backwardsCompatible?
[d,l,e,b]:[b,{settings:d,cache:l,ul:e}]);if(h.isArray(a)&&a[0]!==i){d=h.extend(g,{},d,a[0]||d);l=h.extend(g,{},l,a[1]||l)}}else d=h.extend(g,{},d,a||{});e=!d.newList&&e.hasClass(d.list)?e:!d.newList&&h("ul."+d.list)[0]?h("ul."+d.list).bgiframe().data("autoComplete",g):h("<ul/>").appendTo("body").addClass(d.list).bgiframe().hide().data({"ac-selfmade":g,autoComplete:g});aa();d.requestType=d.requestType.toUpperCase();G=d.multiple?d.multipleSeparator:i;p.data("ac-settings",d);return n=b},"autoComplete.flush":function(b,
a){if(!v)return g;a||(U=0);l={length:0,val:i,list:{}};return n=b},"autoComplete.button-ajax":function(b,a,c){if(!v)return g;if(typeof a==="string"){c=a;a={}}n=b;p.trigger("focus",[w]);l.val=c||"button-ajax_"+w;return q(b,h.extend(g,{},d,{maxItems:-1,postData:a||{}}),l)},"autoComplete.button-supply":function(b,a,c){if(!v)return g;if(typeof a==="string"){c=a;a=i}n=b;p.trigger("focus",[w]);l.val=c||"button-supply_"+w;a=h.isArray(a)&&a.length?a:d.dataSupply;return q(b,h.extend(g,{},d,{maxItems:-1,dataSupply:a,
dataFn:function(){return g}}),l)},"autoComplete.direct-supply":function(b,a,c){if(!v)return g;if(typeof a==="string"){c=a;a=i}n=b;p.trigger("focus",[w]);l.val=c||"direct-supply_"+w;a=h.isArray(a)&&a.length?a:d.dataSupply;return R(b,a,h.extend(g,{},d,{maxItems:-1,dataSupply:a,dataFn:function(){return g}}),l)},"autoComplete.search":function(b,a){if(!v)return g;l.val=a||"";return q(n=b,d,l)},"autoComplete.option":function(b){if(!v)return g;var a=X.call(arguments),c=a.length;n=b;if(c===3){d[a[1]]=a[2];
return a[2]}else if(c===2)switch(a[1]){case "ul":return e;case "cache":return l;case "xhr":return Q;case "input":return p;default:return d[a[1]]||i}else return d},"autoComplete.enable":function(b){p.data("ac-active",v=g);return n=b},"autoComplete.disable":function(b){p.data("ac-active",v=r);e.html("").hide(b);return n=b},"autoComplete.destroy":function(b){var a=e.html("").hide(b).data("ac-inputs"),c;p.removeData("autoComplete").removeData("ac-input-index").removeData("ac-initial-settings").removeData("ac-settings").removeData("ac-active").unbind(".autoComplete autoComplete").closest("form").unbind("submit.autoComplete-"+
u);j.remove(u);ba();v=r;a[u]=i;n=b;for(c in a)if(a.hasOwnProperty(c)&&a[c]===g)return n;e.data("ac-selfmade")===g&&e.remove();return n}}).closest("form").bind("submit.autoComplete-"+u,function(b){if(!v)return g;n=b;return d.preventEnterSubmit&&(F||n["enter_"+w])?r:d.onSubmit.call(f,b,{form:this,settings:d,cache:l,ul:e})});aa();d.requestType=d.requestType.toUpperCase();G=d.multiple?d.multipleSeparator:i;j.stack[u]=f;L()}})(jQuery,window||this);
