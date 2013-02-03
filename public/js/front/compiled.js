(function(t){"use strict";var o=function(){var o=null,n=10,e={left:0,up:1,right:2,down:3},r={arrow:{left:37,up:38,right:39,down:40}},i=200,a=20,c=10,f=[],s={i:{color:"#0f0",states:[[[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]]]},j:{color:"#f00",states:[[[1,1,1,0],[0,0,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[1,1,0,0],[1,0,0,0],[1,0,0,0],[0,0,0,0]]]},l:{color:"#00f",states:[[[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,0,0,0],[1,1,0,0],[0,0,0,0]],[[1,1,1,0],[1,0,0,0],[0,0,0,0],[0,0,0,0]],[[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]]]},t:{color:"#00f",states:[[[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]],[[1,1,1,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]]]},s:{color:"#00f",states:[[[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]]]},z:{color:"#00f",states:[[[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]]]},o:{color:"#00f",states:[[[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]]]}},u=null,l=null,d=0,p=function(){var t,o,n=0;for(t in s)Math.random()<1/++n&&(o=t);return o},v=function(){var t=p(),o={};return o.type=t,o.position={},o.position.x=3,o.position.y=0,o.rotation=0,o.shape=s[o.type].states[o.rotation],o.move=function(t){switch(t){case e.left:--this.position.x;break;case e.up:--this.position.y;break;case e.right:++this.position.x;break;case e.down:++this.position.y}},o.rotate=function(){++this.rotation,this.rotation>=s[this.type].states.length&&(this.rotation=0),this.shape=s[this.type].states[this.rotation]},o},h=function(t,o){var n,e,r,i;for(n=0;4>n;n++)for(e=0;4>e;e++)if(r=t.position.y+n,i=t.position.x+e,t.shape[n][e]&&o[r][i].blocked)return!0;return!1},y=function(t){var o,n,e,r;for(o=0;4>o;o++)for(n=0;4>n;n++)if(e=t.position.y+o,r=t.position.x+n,t.shape[o][n]&&(e>a-1||r>c-1||0>r))return!1;return!0},k=function(o,n,e){var r=t.extend(!0,{},n);return r.move(o),!y(r,e)||h(r,e)?!1:!0},w=function(o,n){var e=t.extend(!0,{},o);return e.rotate(),!y(e,n)||h(e,n)?!1:!0},b=function(){var t,o,n;for(t=0;a>t;t++){for(n=!0,o=0;c>o;o++)f[t][o].blocked||(n=!1);if(n)return!0}return!1},m=function(){var t,o,n,e=0;for(t=a-1;t>=0;){for(n=!0,o=0;c>o;o++)f[t][o].blocked||(n=!1);n?(g(t),++e):--t}M(e)},g=function(o){var n,e;for(n=o;n>0;n--)f[n]=t.extend(!0,[],f[n-1]);for(e=0;c>e;e++)f[0][e]=J()},x=function(o,n){return t('div#tetris-container div.tetris-cell[data-row="'+o+'"][data-column="'+n+'"]')},A=function(o,n){return t('div#tetris-next-block-container div.tetris-cell[data-row="'+o+'"][data-column="'+n+'"]')},D=function(){var t,o,n,e;for(t=0;a>t;t++)for(o=0;c>o;o++)n=f[t][o],e=x(t,o),n.blocked?(e.attr("data-blocked","true"),e.attr("data-block-type",n.type)):(e.removeAttr("data-blocked"),e.removeAttr("data-block-type"))},E=function(){var t,o,n,e,r;if(null!==u)for(t=0;4>t;t++)for(o=0;4>o;o++)n=u.position.x+o,e=u.position.y+t,r=x(e,n),u.shape[t][o]&&(r.attr("data-blocked","true"),r.attr("data-block-type",u.type))},j=function(){var t,o,n;if(null!==l)for(t=0;4>t;t++)for(o=0;4>o;o++)n=A(t,o),l.shape[t][o]?(n.attr("data-blocked","true"),n.attr("data-block-type",l.type)):(n.removeAttr("data-blocked"),n.removeAttr("data-block-type"))},z=function(){D(),E(),j()},I=function(){var t,o,n,e;for(t=0;4>t;t++)for(o=0;4>o;o++)n=u.position.y+t,e=u.position.x+o,f[n]&&f[n][e]&&!f[n][e].blocked&&u.shape[t][o]&&(f[n][e].blocked=!0,f[n][e].type=u.type)},M=function(t){d+=1e3*t,Q()},C=function(){t("#tetris-overlay").show()},G=function(){t("#tetris-overlay").hide()},O=function(o){t("#tetris-message").text(o),C()},P=function(t){for(var o=""+t;n>o.length;)o="0"+o;return o},Q=function(){t("#tetris-current-score").text(P(d))},R=function(){k(e.down,u,f)?u.move(e.down):(I(),b()&&m(),u=l,l=v(),h(u,f)&&(U(),u=null)),z()},S=function(){try{R()}catch(t){F(),console.log(t,t.message)}},U=function(){V(),O("GAME OVER")},V=function(){clearInterval(o)},q=function(){o=setInterval(S,i)},B=function(){V(),q()},F=function(){V(),O("PAUSED")},H=function(){q(),G()},J=function(){return{blocked:!1,type:null}},K=function(){var t,o;for(t=0;a>t;t++)for(f[t]=[],o=0;c>o;o++)f[t][o]=J()},L=function(){u=v()},N=function(){l=v()},T=function(t){switch(t){case r.arrow.left:k(e.left,u,f)&&(u.move(e.left),z(),B());break;case r.arrow.right:k(e.right,u,f)&&(u.move(e.right),z(),B());break;case r.arrow.up:w(u,f)&&(u.rotate(),z(),B());break;case r.arrow.down:for(;k(e.down,u,f);)u.move(e.down);z(),B()}},W=function(){t(document).on("keydown",function(t){var o=t.keyCode||t.which;switch(o){case r.arrow.left:case r.arrow.up:case r.arrow.right:case r.arrow.down:t.preventDefault(),T(o)}})},X=function(){K(),L(),N(),W(),console.log("initialized")};return{init:function(){t("#tetris-pause").on("click",function(t){t.preventDefault(),F()}),t("#tetris-continue").on("click",function(t){t.preventDefault(),H()}),X(),H()}}}();t(document).on("ready",function(){o.init()})})(jQuery);