"use strict";angular.module("d20-engine",["ngRoute"]),angular.module("d20-engine").factory("AbstractLib",["$log","Engine",function(a,b){var c=function(a){this.id=a,this.registered={},this.initLib(),b.registerLib(this.id,this)};return c.prototype.initLib=function(){},c.prototype.change=function(){},c.prototype.changed=function(){},c.prototype.checkConditions=function(c,d){if(!c)return a.warn("No creature provided, returning true."),!0;if(_.isString(d)){var e=d.split(/[\[\]]/)[0];if(!this.registered[e])return a.warn("Can't check condition of unknown stat, returning true.",d),!0;d=this.registered[e]}return _.has(d,"conditions")?!_.find(d.conditions,function(a){return!b.checkCondition(c,a)}):(a.debug("Stat has no condition, returning true;"),!0)},c.prototype.checkCondition=function(){},c.prototype.checkRegistering=function(){return[]},c.prototype.getValue=function(b,c){if(!_.has(b,this.id))return a.warn(this.id+" property not found while computing value, returning 0."),0;var d=b[this.id],e=c.match(/^([a-zA-Z_]+?)(\[(([a-zA-Z_]+?)|([a-zA-Z_]+)\(([a-zA-Z_]+?)\))])?$/);if(!e)return a.warn("Bad property formatting ("+c+") while computing value, returning 0."),0;var f=e[1];if(!_.has(d,f))return 0;d=d[f];var g=e[4]?e[4]:e[5];if(g&&!_.has(d,g))return 0;if(!g)return d;d=d[g];var h=e[6];return h&&!_.has(d,h)?0:h?d[h]:d},c.prototype.register=function(b,c){return this.registered[b]&&a.warn("Stat "+b+" already defined, overwriting.",this.registered[b],c),this.registered[b]=c,this.checkRegistering(b,c)},new Proxy(c,{construct:function(a,b){var c=Object.create(a.prototype);return new Proxy(a.apply(c,b)||c,{get:function(a,b){return _.has(a.prototype,b)?a.prototype[b]:_.has(a.registered,b)?a.registered[b]:a[b]},set:function(){return!0}})}})}]),angular.module("d20-engine").factory("AbstractLoader",["$log","Engine",function(a,b){var c=function(a){this.id=a,this.ALL="all",this.initLoader(),b.registerLoader(this.id,this)};return c.prototype.initLoader=function(){this.registered={}},c.prototype.load=function(){var a=Array.from(arguments);_.forOwn(this.registered,function(b){b.load.apply(b,a)})},c.prototype.register=function(b,c){this.registered[b]&&a.warn("Loader "+b+" already defined, overwriting.",this.registered[b],c),this.registered[b]=c},new Proxy(c,{construct:function(a,b){var c=Object.create(a.prototype);return new Proxy(a.apply(c,b)||c,{get:function(a,b){return _.has(a.prototype,b)?a.prototype[b]:_.has(a.registered,b)?a.registered[b]:a[b]},set:function(){return!0}})}})}]),angular.module("d20-engine").factory("AbstractStatLib",["$log","Engine","AbstractLib",function(a,b,c){var d=angular.copy(c);return d.prototype=Object.create(c.prototype),d.prototype.change=function(b,c){if(void 0!==b&&void 0!==c){if(!_.isString(c))return void a.warn("AbstractStatLib.change called with bad changes parameter",c);var d=this;_.forEach(c.split(","),function(a){d.changeValue(b,a)})}},d.prototype.prepareChange=function(a,b,c,d,e,f){a[this.id]||(a[this.id]={}),a[this.id][b]||d?!a[this.id][b]&&d&&(a[this.id][b]={}):a[this.id][b]=f?{any:c}:c,!d||a[this.id][b][d]||e?d&&!a[this.id][b][d]&&e&&(a[this.id][b][d]={}):a[this.id][b][d]=f?{any:c}:c,d&&e&&!a[this.id][b][d][e]&&(a[this.id][b][d][e]=c),a.old||(a.old={}),a.old[this.id]||(a.old[this.id]={}),d&&!a.old[this.id][b]&&(a.old[this.id][b]={}),d&&e&&!a.old[this.id][b][d]&&(a.old[this.id][b][d]={}),d&&e?a.old[this.id][b][d][e]=a[this.id][b][d][e]:d?a.old[this.id][b][d]=a[this.id][b][d]:a.old[this.id][b]=a[this.id][b]},d.prototype.changeValue=function(c,d){if(void 0===c||void 0===d)return null;if(!_.isString(d))return a.warn("AbstractStatLib.changeStat called with bad change parameter",d),null;var e=d.match(/^(([a-zA-Z_]+?)(\[(([a-zA-Z_]+?)|([a-zA-Z_]+)\(([a-zA-Z_]+?)\))])?)([-+*\/=])([0-9]+|[0-9]+d[0-9]+)$/);if(!e||!e[2]||!e[8])return a.warn("AbstractStatLib.changeStat called with bad change parameter",d),null;var f=e[8],g=e[2],h=e[5]?e[5]:e[6],i=e[7];this.registered[g]&&a.warn("Unknown value provided, changing anyway",g);var j=this.registered[g]?this.registered[g].min:null,k=this.registered[g]?this.registered[g].max:null;this.prepareChange(c,g,j?j:0,h,i,!0),i?(c[this.id][g][h][i]=b.compute(c[this.id][g][h][i],f,e[9],j,k),a.debug(g+"[ "+h+" ][ "+i+" ] changed from "+c.old[this.id][g][h][i]+" to "+c[this.id][g][h][i],c)):h?(c[this.id][g][h].any=b.compute(c[this.id][g][h].any,f,e[9],j,k),a.debug(g+"[ "+h+" ] changed from "+c.old[this.id][g][h]+" to "+c[this.id][g][h],c)):(c[this.id][g].any=b.compute(c[this.id][g].any,f,e[9],j,k),a.debug(g+" changed from "+c.old[this.id][g]+" to "+c[this.id][g],c)),b.changed(this.id,c,e[1])},d.prototype.changed=function(a,b,c){_.forOwn(this.registered,function(d){d.changed(a,b,c)})},d.prototype.checkCondition=function(b,c){if(!b)return a.warn("No creature provided, returning true."),!0;if(!c)return a.info("No condition provided, returning true."),!0;var d=c.match(/^(([a-zA-Z_]+?)(\[(([a-zA-Z_]+?)|([a-zA-Z_]+)\(([a-zA-Z_]+?)\))])?)((>|<|>=|<=|=|!=)([0-9.]+)|(\?|!))$/);if(!d)return a.warn("Condition is not well formatted, unable to check, returning true.",c),!0;var e=d[9],f=d[10],g=d[11],h=this.getValue(b,d[1]);if(e)switch(f=parseFloat(f),e){case">":return h>f;case"<":return h<f;case">=":return h>=f;case"<=":return h<=f;case"=":return h===f;case"!=":return h!==f;default:return!0}if(g)switch(g){case"?":return!!h||h>0;case"!":return!h||h<=0;default:return!0}},d.prototype.getValue=function(b,c){if(!_.has(b,this.id))return a.warn(this.id+" property not found while computing value, returning 0."),0;var d=b[this.id],e=c.match(/^([a-zA-Z_]+?)(\[(([a-zA-Z_]+?)|([a-zA-Z_]+)\(([a-zA-Z_]+?)\))])?$/);if(!e)return a.warn("Bad property formatting ("+c+") while computing value, returning 0."),0;var f=e[1];if(!_.has(d,f))return 0;d=d[f];var g=e[4]?e[4]:e[5];if((!g||g&&!_.has(d,g))&&_.isObject(d)&&!_.has(d,"any"))return 0;if(g&&!_.has(d,g)&&!_.isObject(d)||!g&&!_.isObject(d))return d;if((!g||!_.has(d,g))&&_.isObject(d)&&_.has(d,"any"))return d.any;d=d[g];var h=e[6];return h&&(!h||_.has(d,h))||!_.isObject(d)||_.has(d,"any")?h&&!_.has(d,h)&&!_.isObject(d)||!h&&!_.isObject(d)?d:h&&_.has(d,h)||!_.isObject(d)||!_.has(d,"any")?d[h]:d.any:0},d}]),angular.module("d20-engine").factory("Engine",["$log",function(a){var b=function(){this.registeredLibs={},this.registeredLoaders={}};b.prototype.registerLib=function(b,c){this.registeredLibs[b]&&a.warn("Lib "+b+" already defined, overwriting.",this.registeredLibs[b],c),this.registeredLibs[b]=c},b.prototype.registerLoader=function(b,c){this.registeredLoaders[b]&&a.warn("Loader "+b+" already defined, overwriting.",this.registeredLoaders[b],c),this.registeredLoaders[b]=c},b.prototype.load=function(b){return this.registeredLoaders[b]?void this.registeredLoaders[b].load.apply(this.registeredLoaders[b],Array.from(arguments).slice(1)):void a.warn("Loader "+b+" not existing, loading nothing.")},b.prototype.change=function(b,c,d){return this.registeredLibs[b]?void this.registeredLibs[b].change(c,d):void a.warn("Lib "+b+" not existing, changing nothing.")},b.prototype.changed=function(b,c,d){return this.registeredLibs[b]?void _.forOwn(this.registeredLibs,function(a){a.changed(b,c,d)}):void a.warn("Lib "+b+" not existing, changing nothing.")},b.prototype.checkConditions=function(b,c,d){return this.registeredLibs[b]?this.registeredLibs[b].checkConditions(c,d):(a.warn("Lib "+b+" not existing, checking nothing, returning true."),!0)},b.prototype.checkCondition=function(b,c){var d=c.match(/^(.*)\((.*)\)$/);return this.registeredLibs[d[1]]?this.registeredLibs[d[1]].checkCondition(b,d[2]):(a.warn("Lib "+d[1]+" not existing, checking nothing, returning true."),!0)},b.prototype.compute=function(b,c,d,e,f){var g=this.roll(d);switch(c){case"-":b-=g;break;case"+":b+=g;break;case"*":b*=g;break;case"/":if(0===g)return a.warn("Engine.compute called with bad value for operator /",d),b;b/=g;break;case"=":b=g;break;default:return a.warn("Engine.compute called with bad operator",c),b}return isNaN(e)||(b=Math.max(_.toNumber(e),b)),isNaN(f)||(b=Math.min(_.toNumber(f),b)),b},b.prototype.roll=function(b,c){if(void 0===b)return a.warn("Engine.roll called without parameter, returning 0"),0;var d=[];if(b.split){var e=b.split(",");if(e.length>1){var f=this;return e.map(function(a){return f.roll(a,c)})}_.forEach(b.split("d"),function(a){d.push(isNaN(a)?null:parseFloat(a))})}else d.push(parseFloat(b));return 0===d.length||d.length>2||!_.isNumber(d[0])||d.length>1&&!_.isNumber(d[1])?(a.warn("Engine.roll called with bad parameter, returning 0",b),0):1===d.length?d[0]:(void 0===c&&(c=d[0]),_.sum(_.sortBy(_.range(d[0]).map(function(){return Math.random(1,d[1]+1)}),function(a){return a}).slice(Math.max(0,d[0]-c))))},b.prototype.getValue=function(b,c,d){return this.registeredLibs[b]?this.registeredLibs[b].getValue(c,d):(a.warn("Lib "+b+" not existing, checking nothing, returning true."),!0)},b.prototype.quote=function(a){return a.replace(/(?=[\/\\^$*+?.()|{}[\]])/g,"\\")};var c=new Proxy(b,{construct:function(a,b){var c=Object.create(a.prototype);return new Proxy(a.apply(c,b)||c,{get:function(a,b){return _.has(a.prototype,b)?a.prototype[b]:_.has(a.registeredLibs,b)?a.registeredLibs[b]:a[b]},set:function(){return!0}})}});return new c}]),angular.module("d20-engine").factory("AbstractFeat",["$log","Engine",function(a,b){function c(a){this.min=0,this.max=1,this.conditions=[],this.name="Feat-"+d,this.id=a,this.description="",this.bonuses=[],this.hidden=!1,d++}var d=0;return c.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},c.prototype._checkBonus=function(c,d,e,f,g){a.debug("############ Begin _checkBonus #####################");var h="any"===e||"any"===f||"any"===g,i={};h?i.any={baseBonus:0,bonus:0,malus:0,malusLimit:0,bonusLimit:Number.POSITIVE_INFINITY}:(i.baseBonus=0,i.bonus=0,i.malus=0,i.malusLimit=0,i.bonusLimit=Number.POSITIVE_INFINITY);var j=new RegExp("^(!?)([+-]|)(([a-zA-Z_]+?|#)(\\[((#)|([a-zA-Z_]+?)|([a-zA-Z_]+)\\((#|[a-zA-Z_]+?)\\))])?)((\\2[+\\-*]?)([0-9]+))?;?$".replace("#",b.quote(c)));return _.forEach(this.bonuses,function(k){k=k.replace("#",b.quote(c));var l=k.split("|");if(l.length>1&&b.checkCondition(d,l[0])||1===l.length){var m=(l.length>1?l[1]:l[0]).match(j);if(m){var n=null,o=m[4],p=m[7]?m[7]:m[8]?m[8]:m[9],q=m[10];if(a.debug(o,p,q,e,f,g),o!==e||p===e||g&&p===g||q===e||f&&q===f||(f&&"any"!==f||q&&q!==g?p===f&&q!==f&&(g&&"any"!==g?q===g&&(n="any"):n=q?q:"any"):n=p?p:"any"),n&&(h||"any"===n)){h&&!_.has(i,n)&&(i[n]={baseBonus:0,bonus:0,malus:0,malusLimit:0,bonusLimit:Number.POSITIVE_INFINITY});var r=h?i[n]:i;"!"===m[1]?"+"===m[2]?m[13]?r.bonusLimit=Math.min(r.bonusLimit,parseInt(m[13])):r.bonusLimit=0:"-"===m[2]&&(m[13]?r.malusLimit+=parseInt(m[13]):r.malusLimit=Number.POSITIVE_INFINITY):"+"===m[2]?r.baseBonus+=parseInt(m[13]):"+"===m[12]?r.bonus=Math.max(r.bonus,parseInt(m[13])):"-"===m[12]&&(r.malus+=parseInt(m[13]))}}}}),a.debug("############ End _checkBonus #####################"),i},c.prototype.bonus=function(c,d){var e=d.match(/^([a-zA-Z_]+?|#)(\[((#|[a-zA-Z_]+?)|([a-zA-Z_]+)\((#|[a-zA-Z_]+?)\))])?$/),f={baseBonus:0,bonus:0,malus:0,malusLimit:0,bonusLimit:0};if(!e)return a.warn("Bad skill formatting ("+d+") while computing bonus ("+this.id+"), returning 0."),f;var g=e[1],h=e[4]?e[4]:e[5],i=e[6],j="any"===g||"any"===h||"any"===i;return j&&(f={any:{baseBonus:0,bonus:0,malus:0,malusLimit:0,bonusLimit:0}}),i&&"any"!==i&&b.getValue("feat",c,this.id+"["+i+"]")>0?this._checkBonus(i,c,g,h,i):h&&"any"!==h&&b.getValue("feat",c,this.id+"["+h+"]")>0?this._checkBonus(h,c,g,h,i):g&&"any"!==g&&b.getValue("feat",c,this.id+"["+g+"]")>0?this._checkBonus(g,c,g,h,i):b.getValue("feat",c,this.id)>0?this._checkBonus("any",c,g,h,i):f},c}]),angular.module("d20-engine").factory("FeatLib",["$log","SkillLib","AbstractStatLib",function(a,b,c){var d=angular.copy(c);return d.prototype=Object.create(c.prototype),d.prototype._mergeBonuses=function(b,c){_.has(c,"baseBonus")&&_.has(c,"bonus")&&_.has(c,"malus")&&_.has(c,"bonusLimit")&&_.has(c,"malusLimit")?(b.baseBonus+=c.baseBonus,b.bonus=Math.max(c.bonus,b.bonus),b.malus+=c.malus,b.bonusLimit=Math.min(b.bonusLimit,c.bonusLimit),b.malusLimit+=c.malusLimit):a.warn("Bonus does not contains requested fields, ignoring.",c)},d.prototype.getBonus=function(a,b){var c=this,d={baseBonus:0,bonus:0,malus:0,malusLimit:0,bonusLimit:Number.POSITIVE_INFINITY};return _.forOwn(a[this.id],function(e,f){if(e){var g=c[f].bonus(a,b);c._mergeBonuses(d,g.any?g.any:g)}}),d},d.prototype.getBonuses=function(a,b){var c=this,d={};return _.forOwn(a[this.id],function(e,f){if(e){var g=c[f].bonus(a,b);_.forOwn(g,function(a,b){_.has(d,b)||(d[b]={baseBonus:0,bonus:0,malus:0,malusLimit:0,bonusLimit:Number.POSITIVE_INFINITY}),c._mergeBonuses(d[b],a)})}}),d},d.prototype.checkRegistering=function(c,d){_.forEach(d.bonuses,function(d){_.forEach(d.split(";"),function(e){if(""!==e){e+=";";var f=e.match(/^((.*?)\((.*?)\)\|)?(!?([+-]|)([a-zA-Z_]+?|#)(\[(#|[a-zA-Z_]+?|([a-zA-Z_]+\()(#|[a-zA-Z_]+?)\))])?(\5[+\-*]?[0-9]+)?;)+$/);f?"any"===f[6]||"#"===f[6]||b[f[6]]||a.warn("Unkown skill ("+f[6]+") while loading feat ("+c+"), loading anyway. ("+e+")"):a.warn("Bad bonus formatting ("+e+") while loading feat ("+c+"), loading anyway. ("+d+")")}})})},new d("feat")}]),angular.module("d20-engine").factory("FeatLoader",["AbstractLoader",function(a){return new a("feat")}]),angular.module("d20-engine").factory("AbstractRace",["$log",function(a){function b(a){this.feats=[],this.stats=[],this.languages=[],this.availableLanguages=[],this.name="Race-"+c,this.id=a,this.description="",c++}var c=0;return b.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},b}]),angular.module("d20-engine").factory("RaceLib",["$log","Engine","AbstractLib","StatLib","FeatLib",function(a,b,c,d,e){var f=angular.copy(c);return f.prototype=Object.create(c.prototype),f.prototype.prepareChange=function(a){a.old||(a.old={}),a.old[this.id]=a[this.id]},f.prototype.change=function(c,d){return void 0===c||void 0===d?null:_.isString(d)?(this.registered[d]&&a.warn("Unknown value provided, changing anyway",d),this.prepareChange(c),c[this.id]=d,a.debug(this.id+" changed from "+c.old[this.id]+" to "+c[this.id],c),void b.changed(this.id,c,this.id)):(a.warn("RaceLib.change called with bad change parameter",d),null)},f.prototype.changed=function(a,b,c){_.forOwn(this.registered,function(d){d.changed(a,b,c)})},f.prototype.checkCondition=function(b,c){var d=c.match(/^(\?|!)(.+)$/);if(!d)return a.warn("Condition is not well formatted, unable to check, returning true.",c),!0;var e=d[1],f=d[2];this.registered[f]||a.warn("Check condition of unknown race, continuing anyway.",f);var g=null;switch(_.has(b,this.id)&&(g=b[this.id]),e){case"?":return g===f;case"!":return g!==f;default:return!0}},f.prototype.checkRegistering=function(b,c){_.forEach(c.feats,function(c){var d=c.match(/^([^\[]*?)(\[(.*)])?$/);d?"any"===d[1]||e[d[1]]||a.warn("Unkown feat ("+d[1]+") while loading race ("+b+"), loading anyway."):a.warn("Bad feat formatting ("+c+") while loading race ("+b+"), loading anyway.")}),_.forEach(c.stats,function(c){var e=c.match(/^(.*)[+\-*\/=][0-9]+$/);e?"any"===e[1]||"all"===e[1]||d[e[1]]||a.warn("Unkown stat ("+e[1]+") while loading race ("+b+"), loading anyway."):a.warn("Bad stat formatting ("+c+") while loading race ("+b+"), loading anyway.")})},new f("race")}]),angular.module("d20-engine").factory("RaceLoader",["AbstractLoader",function(a){return new a("race")}]),angular.module("d20-engine").directive("d20SkillDescription",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","SkillLib",function(a,b){a.SkillLib=b}],templateUrl:function(a,b){return"skill/views/"+(b.stat?b.stat+"_":"")+"description.html"}}}),angular.module("d20-engine").directive("d20SkillName",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","SkillLib",function(a,b){a.SkillLib=b}],templateUrl:function(a,b){return"skill/views/"+(b.stat?b.stat+"_":"")+"name.html"}}}),angular.module("d20-engine").directive("d20SkillValue",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","SkillLib",function(a,b){a.SkillLib=b}],templateUrl:function(a,b){return"skill/views/"+(b.stat?b.stat+"_":"")+"value.html"}}}),angular.module("d20-engine").factory("AbstractSkill",["$log","FeatLib","StatLib",function(a,b,c){function d(a){this.min=0,this.max=null,this.name="Skill-"+e,this.id=a,this.stat=null,this.base=0,this.hidden=!1,e++,this.description=""}var e=0;return d.prototype.bonus=function(d,e,f){a.debug("############### Entering skill bonus computing ##################",d,e,f);var g=this.base+(this.stat&&c.registered[this.stat]?c.getBonus(d,this.stat):0),h=e.match(/^(([a-zA-Z_]+?)|([a-zA-Z_]+?)\(([a-zA-Z_]+?)\))$/);if(!h)return a.warn("Bonus target not well formatted, returning base.",e),this.base;if("any"===h[2]||"any"===h[3]||"any"===h[4]){var i={baseBonus:0,bonus:0,malus:0,bonusLimit:Number.POSITIVE_INFINITY,malusLimit:0};_.forOwn(b.getBonuses(d,this.id+"["+e+"]"),function(b,c){f&&f.includes(c)||(a.debug(c,b),i.baseBonus+=b.baseBonus,i.bonus+=b.bonus,i.malus+=b.malus,i.bonusLimit=Math.min(i.bonusLimit,b.bonusLimit),i.malusLimit+=b.malusLimit)}),a.debug(i),g=g+i.baseBonus+Math.min(i.bonus,i.bonusLimit)-Math.max(0,i.malus-i.malusLimit)}else{var j=b.getBonus(d,this.id+"["+e+"]");g=g+j.baseBonus+Math.min(j.bonus,j.bonusLimit)-Math.max(0,j.malus-j.malusLimit)}return a.debug("############### Exiting skill bonus computing ##################",g),g},d.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},d}]),angular.module("d20-engine").factory("SkillLib",["AbstractStatLib",function(a){return new a("skill")}]),angular.module("d20-engine").factory("SkillLoader",["AbstractLoader",function(a){return new a("skill")}]),angular.module("d20-engine").directive("d20StatDescription",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatLib",function(a,b){a.StatLib=b}],templateUrl:function(a,b){return"stat/views/"+(b.stat?b.stat+"_":"")+"description.html"}}}),angular.module("d20-engine").directive("d20StatName",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatLib",function(a,b){a.StatLib=b}],templateUrl:function(a,b){return"stat/views/"+(b.stat?b.stat+"_":"")+"name.html"}}}),angular.module("d20-engine").directive("d20StatValue",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatLib",function(a,b){a.StatLib=b}],templateUrl:function(a,b){return"stat/views/"+(b.stat?b.stat+"_":"")+"value.html"}}}),angular.module("d20-engine").factory("AbstractStat",["$log",function(a){function b(a){this.min=null,this.max=null,this.name="Stat-"+c,this.id=a,c++,this.description=""}var c=0;return b.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},b.prototype.modifier=function(a){return a.stat[this.id]/2-5},b}]),angular.module("d20-engine").factory("StatLib",["AbstractStatLib",function(a){var b=angular.copy(a);return b.prototype=Object.create(a.prototype),b.prototype.getBonus=function(a,b){return _.has(a,this.id)&&_.has(a[this.id],b)?Math.floor(a[this.id][b]/2)-5:-5},new b("stat")}]),angular.module("d20-engine").factory("StatLoader",["AbstractLoader",function(a){return new a("stat")}]),angular.module("d20-engine").directive("d20StatusDescription",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatusLib",function(a,b){a.StatusLib=b}],templateUrl:function(a,b){return"status/views/"+(b.stat?b.stat+"_":"")+"description.html"}}}),angular.module("d20-engine").directive("d20StatusName",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatusLib",function(a,b){a.StatusLib=b}],templateUrl:function(a,b){return"status/views/"+(b.stat?b.stat+"_":"")+"name.html"}}}),angular.module("d20-engine").directive("d20StatusValue",function(){return{restrict:"E",scope:{name:"@",for:"="},controller:["$scope","StatusLib",function(a,b){a.StatusLib=b}],templateUrl:function(a,b){return"status/views/"+(b.stat?b.stat+"_":"")+"value.html"}}}),angular.module("d20-engine").factory("AbstractStatus",["$log",function(a){function b(a){this.min=0,this.max=null,this.minTime=0,this.maxTime=null,this.name="Status-"+c,this.id=a,c++,this.description=""}var c=0;return b.prototype.changed=function(b,c,d){a.debug("Change detected on "+b,this,c,d)},b}]),angular.module("d20-engine").factory("StatusLib",["$log","AbstractStatLib","Engine",function(a,b,c){var d=angular.copy(b);return d.prototype=Object.create(b.prototype),d.prototype.changeValue=function(b,d){if(void 0===b||void 0===d)return null;if(!_.isString(d))return a.warn("StatusLib.changeStat called with bad change parameter",d),null;var e=d.split(/[-+*\/=]/),f=e.length>0?d.substring(e[0].length,e[0].length+1):null,g=e.length>1?d.substring(e[0].length+1+e[1].length,e[0].length+1+e[1].length+1):null,h=e[0].split(/[\[\]]/),i=e[0],j=null;if(3===h.length&&""===h[2]&&""!==h[1]&&""!==h[0]&&(i=h[0],j=h[1]),3!==e.length||null===j&&3===h.length||1!==h.length&&3!==h.length||""===e[1]||""===e[2]||!_.includes(["-","+","*","/","="],f)||!_.includes(["-","+","*","/","="],g))return a.warn("StatusLib.changeStat called with bad change parameter",d),null;var k=this.registered[i]?this.registered[i].min:null,l=this.registered[i]?this.registered[i].minTime:null,m=this.registered[i]?this.registered[i].max:null,n=this.registered[i]?this.registered[i].maxTime:null;this.prepareChange(b,i,{value:k?k:0,time:l?l:0},j),j?(b[this.id][i][j].value=c.compute(b[this.id][i][j].value,f,e[1],k,m),b[this.id][i][j].time=c.compute(b[this.id][i][j].time,g,e[2],l,n),!isNaN(k)&&b[this.id][i][j].time<=_.toNumber(k)&&delete b[this.id][i][j],a.debug(i+"[ "+j+" ] changed from "+b.old[this.id][i][j]+" to "+b[this.id][i][j],b)):(b[this.id][i].value=c.compute(b[this.id][i].value,f,e[1],k,m),b[this.id][i].time=c.compute(b[this.id][i].time,g,e[2],l,n),!isNaN(k)&&b[this.id][i].time<=_.toNumber(k)&&delete b[this.id][i],a.debug(i+" changed from "+b.old[this.id][i].value+" to "+b[this.id][i].value,b)),c.changed(this.id,b,e[0])},d.prototype.super_getValue=d.prototype.getValue,d.prototype.getValue=function(a,b){var c=this.super_getValue(a,b);return!_.isObject(c)||!_.has(c,"value")||_.has(c,"time")&&c.time<=0?0:c.value},new d("status")}]),angular.module("d20-engine").run(["$templateCache",function(a){a.put("skill/views/description.html","<span>{{SkillLib[name].description}}</span>\r\n"),a.put("skill/views/name.html","<span ng-class=\"{'up': creature.skill[name] > creature.old.skill[name], 'down': creature.skill[name] < creature.old.skill[name]}\" ng-title=\"SkillLib[name].description\">SkillLib[name].name</span>\r\n"),a.put("skill/views/value.html","<span ng-class=\"{'up': creature.skill[name] > creature.old.skill[name], 'down': creature.skill[name] < creature.old.skill[name]}\" ng-title=\"SkillLib[name].description\">{{creature.skill[name]}}</span>\r\n"),a.put("stat/views/description.html","<span>{{StatLib[name].description}}</span>\r\n"),a.put("stat/views/name.html","<span ng-class=\"{'up': creature.stat[name] > creature.old.stat[name], 'down': creature.stat[name] < creature.old.stat[name]}\" ng-title=\"StatLib[name].description\">StatLib[name].name</span>\r\n"),a.put("stat/views/value.html","<span ng-class=\"{'up': creature.stat[name] > creature.old.stat[name], 'down': creature.stat[name] < creature.old.stat[name]}\" ng-title=\"StatLib[name].description\">{{creature.stat[name]}}</span>\r\n"),a.put("status/views/description.html","<span>{{StatusLib[name].description}}</span>\n"),a.put("status/views/name.html","<span ng-class=\"{'up': creature.status[name] > creature.old.status[name], 'down': creature.status[name] < creature.old.status[name]}\" ng-title=\"StatusLib[name].description\">StatusLib[name].name</span>\n"),a.put("status/views/value.html","<span ng-class=\"{'up': creature.status[name] > creature.old.status[name], 'down': creature.status[name] < creature.old.status[name]}\" ng-title=\"StatusLib[name].description\">{{creature.status[name].value}}&nbsp;({{creature.status[name].time}})</span>\n")}]);