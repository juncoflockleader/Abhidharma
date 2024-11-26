// https://github.com/johnwalley/d3-simple-slider v2.0.0 Copyright 2023 John Walley
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("d3-transition"),require("d3-axis"),require("d3-array"),require("d3-scale"),require("d3-selection"),require("d3-dispatch"),require("d3-drag"),require("d3-ease")):"function"==typeof define&&define.amd?define(["exports","d3-transition","d3-axis","d3-array","d3-scale","d3-selection","d3-dispatch","d3-drag","d3-ease"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).d3=t.d3||{},t.d3,t.d3,t.d3,t.d3,t.d3,t.d3,t.d3,t.d3)}(this,(function(t,e,a,n,r,l,i,u,c){"use strict";function o(t){if(t&&t.__esModule)return t;var e=Object.create(null);return t&&Object.keys(t).forEach((function(a){if("default"!==a){var n=Object.getOwnPropertyDescriptor(t,a);Object.defineProperty(e,a,n.get?n:{enumerable:!0,get:function(){return t[a]}})}})),e.default=t,Object.freeze(e)}var s=o(l),d="event";function f(t){var e=!(d in s);return function(a,n){e?t.call(this,a,n):t.call(this,s[d],a)}}var h=200,m=8,g=100,p=1,v=2,x=3,k=4;function y(t){return"translate("+t+",0)"}function b(t){return"translate(0,"+t+")"}function w(t,e){e=void 0!==e?e.copy():null;var o=[0],s=[0],d=[0,10],w=100,A=100,M=!0,D="M-5.5,-5.5v10l6,5.5l6,-5.5v-10z",O=null,q=null,j=3,z=null,P=null,F=null,L=null,T=null,V=i.dispatch("onchange","start","end","drag"),E=null,R=null,_=null,B=t===p||t===k?-1:1,H=t===k||t===v?-1:1,Q=t===k||t===v?"y":"x",U=t===k||t===v?"x":"y",C=t===p||t===x?y:b,G=t===p||t===x?b:y,I=null;switch(t){case p:I=a.axisTop;break;case v:I=a.axisRight;break;case x:I=a.axisBottom;break;case k:I=a.axisLeft}var J=null,K=null;function N(a){E=a.selection?a.selection():a,e||(e=(e=d[0]instanceof Date?r.scaleTime():r.scaleLinear()).domain(d).range(t===p||t===x?[0,w]:[A,0]).clamp(!0)),R=r.scaleLinear().range(e.range()).domain(e.range()).clamp(!0),o=o.map((function(t){return r.scaleLinear().range(d).domain(d).clamp(!0)(t)})),P=P||e.tickFormat(),L=L||P||e.tickFormat(),E.selectAll(".axis").data([null]).enter().append("g").attr("transform",G(7*B)).attr("class","axis");var i=E.selectAll(".slider").data([null]),c=i.enter().append("g").attr("class","slider").attr("cursor",t===p||t===x?"ew-resize":"ns-resize").call(u.drag().on("start",f((function(a){l.select(this).classed("active",!0);var r=R(t===x||t===p?a.x:a.y);_=o[0]===d[0]&&o[1]===d[0]?1:o[0]===d[1]&&o[1]===d[1]?0:n.scan(o.map((function(t){return Math.abs(t-W(e.invert(r)))})));var u=o.map((function(t,a){return a===_?W(e.invert(r)):t}));Y(u),V.call("start",i,1===u.length?u[0]:u),X(u,!0)}))).on("drag",f((function(e){var a=h(R(t===x||t===p?e.x:e.y));Y(a),V.call("drag",i,1===a.length?a[0]:a),X(a,!0)}))).on("end",f((function(e){l.select(this).classed("active",!1);var a=h(R(t===x||t===p?e.x:e.y));Y(a),V.call("end",i,1===a.length?a[0]:a),X(a,!0),_=null}))));c.append("line").attr("class","track").attr(Q+"1",e.range()[0]-H*m).attr("stroke","#bbb").attr("stroke-width",6).attr("stroke-linecap","round"),c.append("line").attr("class","track-inset").attr(Q+"1",e.range()[0]-H*m).attr("stroke","#eee").attr("stroke-width",4).attr("stroke-linecap","round"),T&&c.append("line").attr("class","track-fill").attr(Q+"1",1===o.length?e.range()[0]-H*m:e(o[0])).attr("stroke",T).attr("stroke-width",4).attr("stroke-linecap","round"),c.append("line").attr("class","track-overlay").attr(Q+"1",e.range()[0]-H*m).attr("stroke","transparent").attr("stroke-width",40).attr("stroke-linecap","round").merge(i.select(".track-overlay"));var s=c.selectAll(".parameter-value").data(o.map((function(t,e){return{value:t,index:e}}))).enter().append("g").attr("class","parameter-value").attr("transform",(function(t){return C(e(t.value))})).attr("font-family","sans-serif").attr("text-anchor",t===v?"start":t===k?"end":"middle");function h(t){var a=W(e.invert(t));return o.map((function(t,e){return 2===o.length?e===_?0===_?Math.min(a,W(o[1])):Math.max(a,W(o[0])):t:e===_?a:t}))}s.append("path").attr("transform","rotate("+90*(t+1)+")").attr("d",D).attr("class","handle").attr("aria-label","handle").attr("aria-valuemax",d[1]).attr("aria-valuemin",d[0]).attr("aria-valuenow",(function(t){return t.value})).attr("aria-orientation",t===k||t===v?"vertical":"horizontal").attr("focusable","true").attr("tabindex",0).attr("fill","white").attr("stroke","#777").on("keydown",f((function(t,e){var a=O||(d[1]-d[0])/g,r=z?n.scan(z.map((function(t){return Math.abs(o[e.index]-t)}))):null;function l(t){return o.map((function(a,n){return 2===o.length?n===e.index?0===e.index?Math.min(t,W(o[1])):Math.max(t,W(o[0])):a:n===e.index?t:a}))}switch(t.key){case"ArrowLeft":case"ArrowDown":z?N.value(l(z[Math.max(0,r-1)])):N.value(l(+o[e.index]-a)),t.preventDefault();break;case"PageDown":z?N.value(l(z[Math.max(0,r-2)])):N.value(l(+o[e.index]-2*a)),t.preventDefault();break;case"ArrowRight":case"ArrowUp":z?N.value(l(z[Math.min(z.length-1,r+1)])):N.value(l(+o[e.index]+a)),t.preventDefault();break;case"PageUp":z?N.value(l(z[Math.min(z.length-1,r+2)])):N.value(l(+o[e.index]+2*a)),t.preventDefault();break;case"Home":N.value(l(d[0])),t.preventDefault();break;case"End":N.value(l(d[1])),t.preventDefault()}}))),M&&s.append("text").attr("font-size",10).attr(U,B*(24+j)).attr("dy",t===p?"0em":t===x?".71em":".32em").attr("transform",o.length>1?"translate(0,0)":null).text((function(t,e){return L(o[e])})),a.select(".track").attr(Q+"2",e.range()[1]+H*m),a.select(".track-inset").attr(Q+"2",e.range()[1]+H*m),T&&a.select(".track-fill").attr(Q+"2",1===o.length?e(o[0]):e(o[1])),a.select(".track-overlay").attr(Q+"2",e.range()[1]+H*m),a.select(".axis").call(I(e).tickFormat(P).ticks(F).tickValues(q).tickPadding(j)),E.select(".axis").select(".domain").remove(),a.select(".axis").attr("transform",G(7*B)),a.selectAll(".axis text").attr("fill","#aaa").attr(U,B*(17+j)).attr("dy",t===p?"0em":t===x?".71em":".32em").attr("text-anchor",t===v?"start":t===k?"end":"middle"),a.selectAll(".axis line").attr("stroke","#aaa"),a.selectAll(".parameter-value").attr("transform",(function(t){return C(e(t.value))})),S(),K=E.selectAll(".parameter-value text"),J=E.select(".track-fill")}function S(){if(E&&M){var t=[];if(o.forEach((function(e){var a=[];E.selectAll(".axis .tick").each((function(t){a.push(Math.abs(t-e))})),t.push(n.scan(a))})),E.selectAll(".axis .tick text").attr("opacity",(function(e,a){return~t.indexOf(a)?0:1})),K&&o.length>1){var e,a,r=[],l=[];K.nodes().forEach((function(t,n){e=t.getBoundingClientRect(),a=t.getAttribute("transform").split(/[()]/)[1].split(",")["x"===Q?0:1],r[n]=e[Q]-parseFloat(a),l[n]=e["x"===Q?"width":"height"]})),"x"===Q?(a=Math.max(0,(r[0]+l[0]-r[1])/2),K.attr("transform",(function(t,e){return"translate("+(1===e?a:-a)+",0)"}))):(a=Math.max(0,(r[1]+l[1]-r[0])/2),K.attr("transform",(function(t,e){return"translate(0,"+(1===e?-a:a)+")"})))}}}function W(t){if(z){var e=n.scan(z.map((function(e){return Math.abs(t-e)})));return z[e]}if(O){var a=(t-d[0])%O,r=t-a;return 2*a>O&&(r+=O),t instanceof Date?new Date(r):r}return t}function X(t,e){(o[0]!==t[0]||o.length>1&&o[1]!==t[1])&&(o=t,e&&V.call("onchange",N,1===t.length?t[0]:t),S())}function Y(t,a){E&&((a=void 0!==a&&a)?(E.selectAll(".parameter-value").data(t.map((function(t,e){return{value:t,index:e}}))).transition().ease(c.easeQuadOut).duration(h).attr("transform",(function(t){return C(e(t.value))})).select(".handle").attr("aria-valuenow",(function(t){return t.value})),T&&J.transition().ease(c.easeQuadOut).duration(h).attr(Q+"1",1===o.length?e.range()[0]-B*m:e(t[0])).attr(Q+"2",1===o.length?e(t[0]):e(t[1]))):(E.selectAll(".parameter-value").data(t.map((function(t,e){return{value:t,index:e}}))).attr("transform",(function(t){return C(e(t.value))})).select(".handle").attr("aria-valuenow",(function(t){return t.value})),T&&J.attr(Q+"1",1===o.length?e.range()[0]-B*m:e(t[0])).attr(Q+"2",1===o.length?e(t[0]):e(t[1]))),M&&K.text((function(e,a){return L(t[a])})))}return e&&(d=[n.min(e.domain()),n.max(e.domain())],t===p||t===x?w=n.max(e.range())-n.min(e.range()):A=n.max(e.range())-n.min(e.range()),e=e.clamp(!0)),N.min=function(t){return arguments.length?(d[0]=t,e&&e.domain(d),N):d[0]},N.max=function(t){return arguments.length?(d[1]=t,e&&e.domain(d),N):d[1]},N.domain=function(t){return arguments.length?(d=t,e&&e.domain(d),N):d},N.width=function(t){return arguments.length?(w=t,e&&e.range([e.range()[0],e.range()[0]+w]),N):w},N.height=function(t){return arguments.length?(A=t,e&&e.range([e.range()[0],e.range()[0]+A]),N):A},N.tickFormat=function(t){return arguments.length?(P=t,N):P},N.displayFormat=function(t){return arguments.length?(L=t,N):L},N.ticks=function(t){return arguments.length?(F=t,N):F},N.value=function(t){if(!arguments.length)return 1===o.length?o[0]:o;var a=Array.isArray(t)?t:[t];if(a.sort((function(t,e){return t-e})),e){var n=a.map(e).map(R).map(e.invert).map(W);Y(n,!0),X(n,!0)}else o=a;return N},N.silentValue=function(t){if(!arguments.length)return 1===o.length?o[0]:o;var a=Array.isArray(t)?t:[t];if(a.sort((function(t,e){return t-e})),e){var n=a.map(e).map(R).map(e.invert).map(W);Y(n,!1),X(n,!1)}else o=a;return N},N.default=function(t){if(!arguments.length)return 1===s.length?s[0]:s;var e=Array.isArray(t)?t:[t];return e.sort((function(t,e){return t-e})),s=e,o=e,N},N.step=function(t){return arguments.length?(O=t,N):O},N.tickValues=function(t){return arguments.length?(q=t,N):q},N.tickPadding=function(t){return arguments.length?(j=t,N):j},N.marks=function(t){return arguments.length?(z=t,N):z},N.handle=function(t){return arguments.length?(D=t,N):D},N.displayValue=function(t){return arguments.length?(M=t,N):M},N.fill=function(t){return arguments.length?(T=t,N):T},N.on=function(){var t=V.on.apply(V,arguments);return t===V?N:t},N}t.sliderBottom=function(t){return w(x,t)},t.sliderHorizontal=function(t){return w(x,t)},t.sliderLeft=function(t){return w(k,t)},t.sliderRight=function(t){return w(v,t)},t.sliderTop=function(t){return w(p,t)},t.sliderVertical=function(t){return w(k,t)},Object.defineProperty(t,"__esModule",{value:!0})}));
