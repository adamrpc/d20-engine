"use strict";angular.module("d20-engine",["ngRoute"]),angular.module("d20-engine").factory("AbstractLib",["$log","Engine",function(a,b){var c=function(a){this.id=a,this.registered={},this.initLib(),b.registerLib(this.id,this)};return c.prototype.initLib=function(){},c.prototype.change=function(){},c.prototype.changed=function(){},c.prototype.checkConditions=function(c,d){if(!c)return a.warn("No creature provided, returning true."),!0;if(_.isString(d)){var e=d.split(/[\[\]]/)[0];if(!this.registered[e])return a.warn("Can't check condition of unknown stat, returning true.",d),!0;d=this.registered[e]}return _.has(d,"conditions")?!_.find(d.conditions,function(a){return!b.checkCondition(c,a)}):(a.debug("Stat has no condition, returning true;"),!0)},c.prototype.checkCondition=function(){},c.prototype.checkRegistering=function(){return[]},c.prototype.register=function(b,c){return this.registered[b]&&a.warn("Stat "+b+" already defined, overwriting.",this.registered[b],c),this.registered[b]=c,this.checkRegistering(b,c)},new Proxy(c,{construct:function(a,b){var c=Object.create(a.prototype);return new Proxy(a.apply(c,b)||c,{get:function(a,b){return _.has(a.prototype,b)?a.prototype[b]:_.has(a.registered,b)?a.registered[b]:a[b]},set:function(){return!0}})}})}]),angular.module("d20-engine").factory("AbstractLoader",["$log","Engine",function(a,b){var c=function(a){this.id=a,this.ALL="all",this.initLoader(),b.registerLoader(this.name,this)};return c.prototype.initLoader=function(){this.registered={}},c.prototype.load=function(){var a=Array.from(arguments);_.forOwn(this.registered,function(b){b.load.apply(b,a)})},c.prototype.register=function(b,c){this.registered[b]&&a.warn("Loader "+b+" already defined, overwriting.",this.registered[b],c),this.registered[b]=c},new Proxy(c,{construct:function(a,b){var c=Object.create(a.prototype);return new Proxy(a.apply(c,b)||c,{get:function(a,b){return _.has(a.prototype,b)?a.prototype[b]:_.has(a.registered,b)?a.registered[b]:a[b]},set:function(){return!0}})}})}]),angular.module("d20-engine").factory("AbstractStatLib",["$log","Engine","AbstractLib",function(a,b,c){var d=angular.copy(c);return angular.extend(d.prototype,c.prototype),d.prototype.change=function(b,c){if(void 0!==b&&void 0!==c){if(!_.isString(c))return void a.warn("AbstractStatLib.change called with bad changes parameter",c);var d=this;_.forEach(c.split(","),function(a){d.changeValue(b,a)})}},d.prototype.prepareChange=function(a,b,c,d){a[this.id]||(a[this.id]={}),a[this.id][b]||d?!a[this.id][b]&&d&&(a[this.id][b]={}):a[this.id][b]=c,d&&!a[this.id][b][d]&&(a[this.id][b][d]=c),a.old||(a.old={}),a.old[this.id]||(a.old[this.id]={}),!a.old[this.id][b]&&d&&(a.old[this.id][b]={}),d?a.old[this.id][b][d]=a[this.id][b][d]:a.old[this.id][b]=a[this.id][b]},d.prototype.changeValue=function(c,d){if(void 0===c||void 0===d)return null;if(!_.isString(d))return a.warn("AbstractStatLib.changeStat called with bad change parameter",d),null;var e=d.split(/[-+*\/=]/),f=e.length>0?d.substring(e[0].length,e[0].length+1):null,g=e[0].split(/[\[\]]/),h=e[0],i=null;if(3===g.length&&""===g[2]&&""!==g[1]&&""!==g[0]&&(h=g[0],i=g[1]),2!==e.length||""===h||null===i&&3===g.length||1!==g.length&&3!==g.length||""===e[1]||!_.includes(["-","+","*","/","="],f))return a.warn("AbstractStatLib.changeStat called with bad change parameter",d),null;this.registered[h]&&a.warn("Unknown value provided, changing anyway",h);var j=this.registered[h]?this.registered[h].min:null,k=this.registered[h]?this.registered[h].max:null;this.prepareChange(c,h,j?j:0,i),i?(c[this.id][h][i]=b.compute(c[this.id][h][i],f,e[1],j,k),a.debug(h+"[ "+i+" ] changed from "+c.old[this.id][h][i]+" to "+c[this.id][h][i],c)):(c[this.id][h]=b.compute(c[this.id][h],f,e[1],j,k),a.debug(h+" changed from "+c.old[this.id][h]+" to "+c[this.id][h],c)),b.changed(this.id,c,e[0])},d.prototype.changed=function(a,b,c){_.forOwn(this.registered,function(d){d.changed(a,b,c)})},c.prototype.checkCondition=function(b,c){if(!b)return a.warn("No creature provided, returning true."),!0;if(!c)return a.warn("No condition provided, returning true."),!0;var d=c.match(/^(.*?)(\[(.*)])?((>|<|>=|<=|=|!=)([0-9.]+)|(\?|!))$/);if(!d)return a.warn("Condition is not well formatted, unable to check, returning true.",c),!0;var e=d[1],f=d[3],g=d[5],h=d[6],i=d[7];this.registered[e]||a.warn("Unknown stat, checking anyway.",e);var j=null;if(_.has(b,this.id)&&_.has(b[this.id],e)&&(f&&_.has(b[this.id][e],f)?j=b[this.id][e][f]:f||(j=b[this.id][e])),g){if(isNaN(h))return a.warn("Can't process numeric check with non numeric value, returning true.",c),!0;switch(null===j?j=0:_.isObject(j)&&(j=_.keys(j).length),h=parseFloat(h),g){case">":return j>h;case"<":return j<h;case">=":return j>=h;case"<=":return j<=h;case"=":return j===h;case"!=":return j!==h;default:return!0}}if(i)switch(i){case"?":return!!j||j>0;case"!":return!j||j<=0;default:return!0}},d}]),angular.module("d20-engine").factory("Engine",["$log",function(a){var b=function(){this.registeredLibs={},this.registeredLoaders={}};b.prototype.registerLib=function(b,c){this.registeredLibs[b]&&a.warn("Lib "+b+" already defined, overwriting.",this.registeredLibs[b],c),this.registeredLibs[b]=c},b.prototype.registerLoader=function(b,c){this.registeredLoaders[b]&&a.warn("Loader "+b+" already defined, overwriting.",this.registeredLoaders[b],c),this.registeredLoaders[b]=c},b.prototype.load=function(b){return this.registeredLoaders[b]?void this.registeredLoaders[b].load.apply(this.registeredLoaders[b],Array.from(arguments).slice(1)):void a.warn("Loader "+b+" not existing, loading nothing.")},b.prototype.change=function(b,c,d){return this.registeredLibs[b]?void this.registeredLibs[b].change(c,d):void a.warn("Lib "+b+" not existing, changing nothing.")},b.prototype.changed=function(b,c,d){return this.registeredLibs[b]?void _.forOwn(this.registeredLibs,function(a){a.changed(b,c,d)}):void a.warn("Lib "+b+" not existing, changing nothing.")},b.prototype.checkConditions=function(b,c,d){return this.registeredLibs[b]?this.registeredLibs[b].checkConditions(c,d):(a.warn("Lib "+b+" not existing, checking nothing, returning true."),!0)},b.prototype.checkCondition=function(b,c){var d=c.match(/^(.*)\((.*)\)$/);return this.registeredLibs[d[1]]?this.registeredLibs[d[1]].checkCondition(b,d[2]):(a.warn("Lib "+d[1]+" not existing, checking nothing, returning true."),!0)},b.prototype.compute=function(b,c,d,e,f){var g=this.roll(d);switch(c){case"-":b-=g;break;case"+":b+=g;break;case"*":b*=g;break;case"/":if(0===g)return a.warn("Engine.compute called with bad value for operator /",d),b;b/=g;break;case"=":b=g;break;default:return a.warn("Engine.compute called with bad operator",c),b}return isNaN(e)||(b=Math.max(_.toNumber(e),b)),isNaN(f)||(b=Math.min(_.toNumber(f),b)),b},b.prototype.roll=function(b,c){if(void 0===b)return a.warn("Engine.roll called without parameter, returning 0"),0;var d=[];if(b.split){var e=b.split(",");if(e.length>1){var f=this;return e.map(function(a){return f.roll(a,c)})}_.forEach(b.split("d"),function(a){d.push(isNaN(a)?null:parseFloat(a))})}else d.push(parseFloat(b));return 0===d.length||d.length>2||!_.isNumber(d[0])||d.length>1&&!_.isNumber(d[1])?(a.warn("Engine.roll called with bad parameter, returning 0",b),0):1===d.length?d[0]:(void 0===c&&(c=d[0]),_.sum(_.sortBy(_.range(d[0]).map(function(){return Math.random(1,d[1]+1)}),function(a){return a}).slice(Math.max(0,d[0]-c))))};var c=new Proxy(b,{construct:function(a,b){var c=Object.create(a.prototype);return new Proxy(a.apply(c,b)||c,{get:function(a,b){return _.has(a.prototype,b)?a.prototype[b]:_.has(a.registeredLibs,b)?a.registeredLibs[b]:a[b]},set:function(){return!0}})}});return new c}]),angular.module("d20-engine").factory("AbstractGift",["$log",function(a){function b(a){this.min=0,this.max=1,this.conditions=[],this.name="Gift-"+c,this.id=a,this.description="",this.bonuses=[],this.hidden=!1,c++}var c=0;return b.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},b}]),angular.module("d20-engine").factory("GiftLib",["PerkLib","AbstractStatLib",function(a,b){var c=angular.copy(b);return angular.extend(c.prototype,b.prototype),c.prototype.checkRegistering=function(b,c){var d=[];return _.forEach(c.bonuses,function(c){_.forEach(c.split(";"),function(e){if(""!==e){e+=";";var f=e.match(/^((limit\([0-9]+[smhj]\)|skill\(([a-zA-Z_]+?|#)\)\.(lvl)(<|<=|>=|>|=|!=)[0-9]+)\|)?(!?([+-]|)([a-zA-Z_]+?|#)(\[(#|[a-zA-Z_]+?|(spell\(|effect\()(#|[a-zA-Z_]+?)\))])?(\7[+\-*]?[0-9]+|=(level|stat\[[a-zA-Z_]+?]))?;|(spell\(|effect\()(#|[a-zA-Z_]+?)\);)+$/);if(f){var g=f[8]?f[8]:f[16];"any"===g||"#"===g||a[g]||d.push("Unkown skill ("+g+") while loading gift ("+b+"), loading anyway. ("+e+")")}else d.push("Bad bonus formatting ("+e+") while loading gift ("+b+"), loading anyway. ("+c+")")}})}),d},new c("gift")}]),angular.module("d20-engine").factory("GiftLoader",["AbstractLoader",function(a){return new a("gift")}]),angular.module("d20-engine").directive("d20PerkDescription",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","PerkLib",function(a,b){a.PerkLib=b}],templateUrl:function(a,b){return"perk/views/"+(b.stat?b.stat+"_":"")+"description.html"}}}),angular.module("d20-engine").directive("d20PerkName",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","PerkLib",function(a,b){a.PerkLib=b}],templateUrl:function(a,b){return"perk/views/"+(b.stat?b.stat+"_":"")+"name.html"}}}),angular.module("d20-engine").directive("d20PerkValue",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","PerkLib",function(a,b){a.PerkLib=b}],templateUrl:function(a,b){return"perk/views/"+(b.stat?b.stat+"_":"")+"value.html"}}}),angular.module("d20-engine").factory("AbstractPerk",["$log",function(a){function b(a){this.min=0,this.max=null,this.name="Perk-"+c,this.id=a,c++,this.description=""}var c=0;return b.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},b}]),angular.module("d20-engine").factory("PerkLib",["AbstractStatLib",function(a){return new a("perk")}]),angular.module("d20-engine").factory("AbstractRace",["$log",function(a){function b(a){this.gifts=[],this.stats=[],this.languages=[],this.availableLanguages=[],this.name="Race-"+c,this.id=a,this.description="",c++}var c=0;return b.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},b}]),angular.module("d20-engine").factory("RaceLib",["$log","Engine","AbstractLib","StatLib","GiftLib",function(a,b,c,d,e){var f=angular.copy(c);return angular.extend(f.prototype,c.prototype),f.prototype.prepareChange=function(a){a.old||(a.old={}),a.old[this.id]=a[this.id]},f.prototype.change=function(c,d){return void 0===c||void 0===d?null:_.isString(d)?(this.registered[d]&&a.warn("Unknown value provided, changing anyway",d),this.prepareChange(c),c[this.id]=d,a.debug(this.id+" changed from "+c.old[this.id]+" to "+c[this.id],c),void b.changed(this.id,c,this.id)):(a.warn("RaceLib.change called with bad change parameter",d),null)},f.prototype.changed=function(a,b,c){_.forOwn(this.registered,function(d){d.changed(a,b,c)})},f.prototype.checkCondition=function(b,c){var d=c.match(/^(\?|!)(.+)$/);if(!d)return a.warn("Condition is not well formatted, unable to check, returning true.",c),!0;var e=d[1],f=d[2];this.registered[f]||a.warn("Check condition of unknown race, continuing anyway.",f);var g=null;switch(_.has(b,this.id)&&(g=b[this.id]),e){case"?":return g===f;case"!":return g!==f;default:return!0}},f.prototype.checkRegistering=function(a,b){var c=[];return _.forEach(b.gifts,function(b){var d=b.match(/^([^\[]*?)(\[(.*)])?$/);d?"any"===d[1]||e[d[1]]||c.push("Unkown gift ("+d[1]+") while loading race ("+a+"), loading anyway."):c.push("Bad gift formatting ("+b+") while loading race ("+a+"), loading anyway.")}),_.forEach(b.stats,function(b){var e=b.match(/^(.*)[+\-*\/=][0-9]+$/);e?"any"===e[1]||"all"===e[1]||d[e[1]]||c.push("Unkown stat ("+e[1]+") while loading race ("+a+"), loading anyway."):c.push("Bad stat formatting ("+b+") while loading race ("+a+"), loading anyway.")}),c},new f("race")}]),angular.module("d20-engine").factory("RaceLoader",["AbstractLoader",function(a){return new a("race")}]),angular.module("d20-engine").directive("d20StatDescription",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatLib",function(a,b){a.StatLib=b}],templateUrl:function(a,b){return"stat/views/"+(b.stat?b.stat+"_":"")+"description.html"}}}),angular.module("d20-engine").directive("d20StatName",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatLib",function(a,b){a.StatLib=b}],templateUrl:function(a,b){return"stat/views/"+(b.stat?b.stat+"_":"")+"name.html"}}}),angular.module("d20-engine").directive("d20StatValue",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatLib",function(a,b){a.StatLib=b}],templateUrl:function(a,b){return"stat/views/"+(b.stat?b.stat+"_":"")+"value.html"}}}),angular.module("d20-engine").factory("AbstractStat",["$log",function(a){function b(a){this.min=null,this.max=null,this.name="Stat-"+c,this.id=a,c++,this.description=""}var c=0;return b.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},b.prototype.modifier=function(a){return a.stat[this.id]/2-5},b}]),angular.module("d20-engine").factory("StatLib",["AbstractStatLib",function(a){return new a("stat")}]),angular.module("d20-engine").factory("StatLoader",["AbstractLoader",function(a){return new a("stat")}]),angular.module("d20-engine").directive("d20StatusDescription",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","PerkLib",function(a,b){a.PerkLib=b}],templateUrl:function(a,b){return"perk/views/"+(b.stat?b.stat+"_":"")+"description.html"}}}),angular.module("d20-engine").directive("d20StatusName",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","PerkLib",function(a,b){a.PerkLib=b}],templateUrl:function(a,b){return"perk/views/"+(b.stat?b.stat+"_":"")+"name.html"}}}),angular.module("d20-engine").directive("d20StatusValue",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","PerkLib",function(a,b){a.PerkLib=b}],templateUrl:function(a,b){return"perk/views/"+(b.stat?b.stat+"_":"")+"value.html"}}}),angular.module("d20-engine").factory("AbstractStatus",["$log",function(a){function b(a){this.min=0,this.max=null,this.minTime=0,this.maxTime=null,this.name="Status-"+c,this.id=a,c++,this.description=""}var c=0;return b.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},b}]),angular.module("d20-engine").factory("StatusLib",["$log","AbstractStatLib","Engine",function(a,b,c){var d=angular.copy(b);return angular.extend(d.prototype,b.prototype),d.prototype.changeValue=function(b,d){if(void 0===b||void 0===d)return null;if(!_.isString(d))return a.warn("StatusLib.changeStat called with bad change parameter",d),null;var e=d.split(/[-+*\/=]/),f=e.length>0?d.substring(e[0].length,e[0].length+1):null,g=e.length>1?d.substring(e[0].length+1+e[1].length,e[0].length+1+e[1].length+1):null,h=e[0].split(/[\[\]]/),i=e[0],j=null;if(3===h.length&&""===h[2]&&""!==h[1]&&""!==h[0]&&(i=h[0],j=h[1]),3!==e.length||null===j&&3===h.length||1!==h.length&&3!==h.length||""===e[1]||""===e[2]||!_.includes(["-","+","*","/","="],f)||!_.includes(["-","+","*","/","="],g))return a.warn("StatusLib.changeStat called with bad change parameter",d),null;var k=this.registered[i]?this.registered[i].min:null,l=this.registered[i]?this.registered[i].minTime:null,m=this.registered[i]?this.registered[i].max:null,n=this.registered[i]?this.registered[i].maxTime:null;this.prepareChange(b,i,{value:k?k:0,time:l?l:0},j),j?(b[this.id][i][j].value=c.compute(b[this.id][i][j].value,f,e[1],k,m),b[this.id][i][j].time=c.compute(b[this.id][i][j].time,g,e[2],l,n),!isNaN(k)&&b[this.id][i][j].time<=_.toNumber(k)&&delete b[this.id][i][j],a.debug(i+"[ "+j+" ] changed from "+b.old[this.id][i][j]+" to "+b[this.id][i][j],b)):(b[this.id][i].value=c.compute(b[this.id][i].value,f,e[1],k,m),b[this.id][i].time=c.compute(b[this.id][i].time,g,e[2],l,n),!isNaN(k)&&b[this.id][i].time<=_.toNumber(k)&&delete b[this.id][i],a.debug(i+" changed from "+b.old[this.id][i].value+" to "+b[this.id][i].value,b)),c.changed(this.id,b,e[0])},new d("status")}]),angular.module("d20-engine").run(["$templateCache",function(a){a.put("perk/views/description.html","<span>{{PerkLib[name].description}}</span>\r\n"),a.put("perk/views/name.html","<span ng-class=\"{'up': creature.perk[name] > creature.old.perk[name], 'down': creature.perk[name] < creature.old.perk[name]}\" ng-title=\"PerkLib[name].description\">PerkLib[name].name</span>\r\n"),a.put("perk/views/value.html","<span ng-class=\"{'up': creature.perk[name] > creature.old.perk[name], 'down': creature.perk[name] < creature.old.perk[name]}\" ng-title=\"PerkLib[name].description\">{{creature.perk[name]}}</span>\r\n"),a.put("stat/views/description.html","<span>{{StatLib[name].description}}</span>\r\n"),a.put("stat/views/name.html","<span ng-class=\"{'up': creature.stat[name] > creature.old.stat[name], 'down': creature.stat[name] < creature.old.stat[name]}\" ng-title=\"StatLib[name].description\">StatLib[name].name</span>\r\n"),a.put("stat/views/value.html","<span ng-class=\"{'up': creature.stat[name] > creature.old.stat[name], 'down': creature.stat[name] < creature.old.stat[name]}\" ng-title=\"StatLib[name].description\">{{creature.stat[name]}}</span>\r\n"),a.put("status/views/description.html","<span>{{StatusLib[name].description}}</span>\n"),a.put("status/views/name.html","<span ng-class=\"{'up': creature.status[name] > creature.old.status[name], 'down': creature.status[name] < creature.old.status[name]}\" ng-title=\"StatusLib[name].description\">StatusLib[name].name</span>\n"),a.put("status/views/value.html","<span ng-class=\"{'up': creature.status[name] > creature.old.status[name], 'down': creature.status[name] < creature.old.status[name]}\" ng-title=\"StatusLib[name].description\">{{creature.status[name].value}}&nbsp;({{creature.status[name].time}})</span>\n")}]);