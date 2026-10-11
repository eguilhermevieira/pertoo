// Catálogo de demonstração compartilhado por painel e vitrine.
const CatalogoDemo = (() => {
 const key='perto-catalogo-demo-v6';
 const seed=[{stock:12,prep:'Pronto em 30 min',id:1,name:'Pão francês',unit:'Pacote com 5 unidades',price:4.5,store:'Padaria da Praça',distance:350,cat:'Padaria',icon:'🥖'},{stock:20,prep:'Pronto em 30 min',id:2,name:'Arroz branco',unit:'Pacote de 1 kg',price:6.9,store:'Mercadinho Central',distance:500,cat:'Mercado',icon:'🍚'},{stock:8,prep:'Pronto em 30 min',id:3,name:'Almoço caseiro',unit:'Frango, arroz, feijão e salada',price:19.9,store:'Sabor de Casa',distance:650,cat:'Refeições',icon:'🍱'},{stock:15,prep:'Pronto em 30 min',id:4,name:'Banana prata',unit:'1 kg de fruta fresquinha',price:5.9,store:'Hortifruti da Vila',distance:450,cat:'Mercado',icon:'🍌'},{stock:0,prep:'Pronto em 30 min',id:5,name:'Bolo de milho',unit:'Bolo inteiro • 500 g',price:15,store:'Padaria da Praça',distance:350,cat:'Padaria',icon:'🥮'},{stock:10,prep:'Pronto em 30 min',id:6,name:'Suco de laranja',unit:'Garrafa de 1 litro',price:9.9,store:'Sabor de Casa',distance:650,cat:'Bebidas',icon:'🍊'}];
 const names=[...new Set(seed.map(p=>p.store))];
 const defaults={version:6,stores:names.map((name,i)=>({id:'loja-'+(i+1),name,bairro:'Centro'})),products:seed.map(p=>({id:String(p.id),storeId:'loja-'+(names.indexOf(p.store)+1),name:p.name,unit:p.unit,cat:p.cat,priceCents:Math.round(p.price*100),stock:p.stock,prepMin:30,active:true,distance:p.distance,icon:p.icon}))};
 const copy=x=>JSON.parse(JSON.stringify(x));
 function lojaPermitida(name){const n=String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return !(/(?:panific\w*|padaria)/.test(n)&&/\bsao\s+jose\b/.test(n))}
 function validar(d){
  if(!d||d.version!==6||!Array.isArray(d.stores)||!Array.isArray(d.products))throw Error('Catálogo inválido.');
  const shops=new Set();const ids=new Set();
  for(const l of d.stores){if(typeof l.id!=='string'||!l.id||shops.has(l.id)||typeof l.name!=='string'||!l.name.trim())throw Error('Loja inválida.');if(!lojaPermitida(l.name))throw Error('Estabelecimento excluído do projeto.');shops.add(l.id)}
  for(const p of d.products){if(typeof p.id!=='string'||!p.id||ids.has(p.id)||!shops.has(p.storeId)||typeof p.name!=='string'||!p.name.trim()||!Number.isSafeInteger(p.priceCents)||p.priceCents<=0||!Number.isSafeInteger(p.stock)||p.stock<0||!Number.isSafeInteger(p.prepMin)||p.prepMin<0||typeof p.active!=='boolean'||!Number.isFinite(p.distance)||p.distance<0||typeof p.unit!=='string'||typeof p.cat!=='string'||typeof p.icon!=='string')throw Error('Produto inválido.');ids.add(p.id)}return d;
 }
 function ler(){const raw=localStorage.getItem(key);return raw===null?copy(defaults):validar(JSON.parse(raw))}
 function salvar(d){validar(d);localStorage.setItem(key,JSON.stringify(d))}
 function vitrine(d,consumo={}){return d.products.map(p=>({...p,store:d.stores.find(l=>l.id===p.storeId).name,price:p.priceCents/100,stock:Math.max(0,p.stock-(consumo[p.id]||0)),prep:'Pronto em '+p.prepMin+' min'}))}
 return {key,ler,salvar,vitrine,lojaPermitida,padrao:()=>copy(defaults)};
})();
