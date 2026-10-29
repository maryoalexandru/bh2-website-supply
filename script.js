const products = [
{id:1,name:"Core Logo Tee",category:"tops",price:29,tag:"BESTSELLER",kind:"tee",mark:"BH2",color:"Washed black"},
{id:2,name:"Everyday Hoodie",category:"tops",price:64,tag:"NEW",kind:"hoodie",mark:"V.",color:"Stone"},
{id:3,name:"Signal Cap",category:"accessories",price:24,tag:"LIMITED",kind:"cap",mark:"VS",color:"Signal red"},
{id:4,name:"Utility Tote",category:"accessories",price:19,tag:"ESSENTIAL",kind:"tote",mark:"HUNT",color:"Natural"},
{id:5,name:"After Hours Tee",category:"tops",price:32,tag:"NEW",kind:"tee",mark:"AFTER",color:"Washed black"},
{id:6,name:"Studio Hoodie",category:"tops",price:68,tag:"LIMITED",kind:"hoodie",mark:"STUDIO",color:"Stone"},
{id:7,name:"Daily Cap",category:"accessories",price:22,tag:"ESSENTIAL",kind:"cap",mark:"V.",color:"Signal red"},
{id:8,name:"Everyday Tote",category:"accessories",price:21,tag:"NEW",kind:"tote",mark:"BH2",color:"Natural"}
];
const cart = new Map();
const grid=document.getElementById("productGrid"), drawer=document.getElementById("cartDrawer"), backdrop=document.getElementById("cartBackdrop");
const cartItems=document.getElementById("cartItems"), cartEmpty=document.getElementById("cartEmpty"), cartFooter=document.getElementById("cartFooter"), toast=document.getElementById("toast");
let toastTimer;
function euro(n){return new Intl.NumberFormat("en-IE",{style:"currency",currency:"EUR"}).format(n)}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
function renderProducts(){
 let list=products.filter(p=>document.getElementById("categoryFilter").value==="all"||p.category===document.getElementById("categoryFilter").value);
 const sort=document.getElementById("sortProducts").value;if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-art ${p.kind}"><span class="product-badge">${p.tag}</span><div class="art-shape"></div><span class="art-mark">${p.mark}</span><span class="product-label">${p.color.toUpperCase()} / 001</span><button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div><div class="product-info"><div class="product-title-line"><span>${p.name}</span><span>${euro(p.price)}</span></div><p class="product-category">${p.category==="tops"?"APPAREL":"ACCESSORIES"} · ${p.color}</p></div></article>`).join("");
}
function renderCart(){
 const count=[...cart.values()].reduce((s,p)=>s+p.qty,0);document.getElementById("cartCount").textContent=count;document.getElementById("drawerCount").textContent=`(${count})`;cartEmpty.hidden=count>0;cartFooter.hidden=count===0;
 cartItems.innerHTML=[...cart.values()].map(p=>`<div class="cart-item"><div class="cart-thumb">${p.mark}</div><div><h3>${p.name}</h3><p>${p.color} · ${euro(p.price)}</p><div class="quantity-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${p.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div><button class="remove-item" data-remove="${p.id}">Remove</button></div><div class="item-price">${euro(p.price*p.qty)}</div></div>`).join("");
 document.getElementById("cartSubtotal").textContent=euro([...cart.values()].reduce((s,p)=>s+p.price*p.qty,0));
}
function addToCart(id){const p=products.find(x=>x.id===Number(id));if(!p)return;const old=cart.get(p.id);if(old)old.qty++;else cart.set(p.id,{...p,qty:1});renderCart();showToast(`${p.name} added to your bag`)}
function openCart(){drawer.classList.add("open");backdrop.classList.add("open");drawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";document.getElementById("closeCart").focus()}
function closeCart(){drawer.classList.remove("open");backdrop.classList.remove("open");drawer.setAttribute("aria-hidden","true");document.body.style.overflow="";document.getElementById("openCart").focus()}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(b.dataset.add)});
cartItems.addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const p=cart.get(Number(q.dataset.qty));if(p){p.qty+=Number(q.dataset.delta);if(p.qty<=0)cart.delete(p.id)}renderCart()}if(r){cart.delete(Number(r.dataset.remove));renderCart()}});
document.getElementById("categoryFilter").addEventListener("change",renderProducts);document.getElementById("sortProducts").addEventListener("change",renderProducts);
document.getElementById("openCart").addEventListener("click",openCart);document.getElementById("closeCart").addEventListener("click",closeCart);backdrop.addEventListener("click",closeCart);document.getElementById("continueShopping").addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&drawer.classList.contains("open"))closeCart()});
document.getElementById("checkoutButton").addEventListener("click",()=>showToast("Demo only — connect a checkout service to accept real orders."));
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterNote").textContent="Thanks! This demo does not send or save email addresses.";document.getElementById("emailInput").value=""});
renderProducts();renderCart();