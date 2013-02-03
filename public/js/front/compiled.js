(function(t){"use strict";var o=function(){var o=null,n={left:0,up:1,right:2,down:3},r={arrow:{left:37,up:38,right:39,down:40}},e=200,i=20,a=10,c=[],s={i:{color:"#0f0",states:[[[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]]]},j:{color:"#f00",states:[[[1,1,1,0],[0,0,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[1,1,0,0],[1,0,0,0],[1,0,0,0],[0,0,0,0]]]},l:{color:"#00f",states:[[[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,0,0,0],[1,1,0,0],[0,0,0,0]],[[1,1,1,0],[1,0,0,0],[0,0,0,0],[0,0,0,0]],[[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]]]},t:{color:"#00f",states:[[[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]],[[1,1,1,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]]]},s:{color:"#00f",states:[[[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]]]},z:{color:"#00f",states:[[[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]]]},o:{color:"#00f",states:[[[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]]]}},f=null,u=function(){var t,o,n=0;for(t in s)Math.random()<1/++n&&(o=t);return o},l=function(){var t=u(),o={};return o.type=t,o.position={},o.position.x=0,o.position.y=0,o.rotation=0,o.shape=s[o.type].states[o.rotation],o.move=function(t){switch(t){case n.left:--this.position.x;break;case n.up:--this.position.y;break;case n.right:++this.position.x;break;case n.down:++this.position.y}},o.rotate=function(){++this.rotation,this.rotation>=s[this.type].states.length&&(this.rotation=0),this.shape=s[this.type].states[this.rotation]},o},p=function(t,o){var n,r,e,i;for(n=0;4>n;n++)for(r=0;4>r;r++)if(e=t.position.y+n,i=t.position.x+r,t.shape[n][r]&&o[e][i].blocked)return!0;return!1},d=function(t){var o,n,r,e;for(o=0;4>o;o++)for(n=0;4>n;n++)if(r=t.position.y+o,e=t.position.x+n,t.shape[o][n]&&(r>i-1||e>a-1||0>e))return!1;return!0},h=function(o,n,r){var e=t.extend(!0,{},n);return e.move(o),!d(e,r)||p(e,r)?!1:!0},v=function(o,n){var r=t.extend(!0,{},o);return r.rotate(),!d(r,n)||p(r,n)?!1:!0},y=function(){var t,o,n;for(t=0;i>t;t++){for(n=!0,o=0;a>o;o++)c[t][o].blocked||(n=!1);if(n)return!0}return!1},k=function(){var t,o,n;for(t=i-1;t>=0;){for(n=!0,o=0;a>o;o++)c[t][o].blocked||(n=!1);n?w(t):--t}},w=function(t){var o,n;for(o=t;o>0;o--)c[o]=c[o-1];for(n=0;a>n;n++)c[0][n]=B()},b=function(o,n){return t('div.tetris-cell[data-row="'+o+'"][data-column="'+n+'"]')},m=function(){var t,o,n,r;for(t=0;i>t;t++)for(o=0;a>o;o++)n=c[t][o],r=b(t,o),n.blocked?(r.attr("data-blocked","true"),r.attr("data-block-type",n.type)):(r.removeAttr("data-blocked"),r.removeAttr("data-block-type"))},g=function(){var t,o,n,r,e;if(null!==f)for(e=b(f.position.y,f.position.x),t=0;4>t;t++)for(o=0;4>o;o++)n=f.position.x+o,r=f.position.y+t,e=b(r,n),f.shape[t][o]&&(e.attr("data-blocked","true"),e.attr("data-block-type",f.type))},x=function(){m(),g()},D=function(){var t,o,n,r;for(t=0;4>t;t++)for(o=0;4>o;o++)n=f.position.y+t,r=f.position.x+o,c[n]&&c[n][r]&&!c[n][r].blocked&&f.shape[t][o]&&(c[n][r].blocked=!0,c[n][r].type=f.type)},j=function(){h(n.down,f,c)?f.move(n.down):(D(),y()&&k(),f=l(),p(f,c)&&(A(),f=null)),x()},z=function(){try{j()}catch(t){Q(),console.log(t,t.message)}},A=function(){I()},I=function(){clearInterval(o)},C=function(){o=setInterval(z,e)},M=function(){I(),C()},Q=function(){I()},q=function(){C()},B=function(){return{blocked:!1,type:null}},E=function(){var t,o;for(t=0;i>t;t++)for(c[t]=[],o=0;a>o;o++)c[t][o]=B()},F=function(){f=l()},G=function(t){switch(t){case r.arrow.left:h(n.left,f,c)&&(f.move(n.left),x(),M());break;case r.arrow.right:h(n.right,f,c)&&(f.move(n.right),x(),M());break;case r.arrow.up:v(f,c)&&(f.rotate(),x(),M())}},H=function(){t(document).on("keydown",function(t){var o=t.keyCode||t.which;switch(o){case r.arrow.left:case r.arrow.up:case r.arrow.right:case r.arrow.down:t.preventDefault(),G(o)}})},J=function(){E(),F(),H(),console.log("initialized")};return{init:function(){t("#tetris-pause").on("click",function(t){t.preventDefault(),Q()}),t("#tetris-continue").on("click",function(t){t.preventDefault(),q()}),J(),q()}}}();t(document).on("ready",function(){o.init()})})(jQuery);