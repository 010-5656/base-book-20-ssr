"use strict";exports.id=850,exports.ids=[850],exports.modules={499:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var r=n(689),u=n.n(r),l=n(661);const s=function(e){var t=e.users;return t?u().createElement("div",null,u().createElement("ul",null,t.map((function(e){return u().createElement("li",{key:e.id},u().createElement(l.Link,{to:"/users/".concat(e.id)},e.username))})))):null};var c=n(22),a=n(821),i=n(701),m=u().useEffect;const o=(0,c.connect)((function(e){return{users:e.users.users}}),{getUsers:a.Rf})((function(e){var t=e.users,n=e.getUsers;return m((function(){t||n()}),[n,t]),u().createElement(u().Fragment,null,u().createElement(s,{users:t}),u().createElement(i.p9,{resolve:n}))})),f=function(e){var t=e.user,n=t.email,r=t.name,l=t.username;return u().createElement("div",null,u().createElement("h1",null,l,"(",r,")"),u().createElement("p",null,u().createElement("b",null,"e-mail:"),n))},E=function(e){var t=e.id,n=(0,c.useSelector)((function(e){return e.users.user})),l=(0,c.useDispatch)();return(0,i.lm)((function(){return l((0,a.PR)(t))})),(0,r.useEffect)((function(){n&&n.id===parseInt(t,10)||l((0,a.PR)(t))}),[l,t,n]),n?u().createElement(f,{user:n}):null},d=function(){return u().createElement(u().Fragment,null,u().createElement(o,null),u().createElement(l.Route,{path:"/users/:id",render:function(e){var t=e.match;return u().createElement(E,{id:t.params.id})}}))}}};