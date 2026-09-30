/*
  HallBook frontend
  The browser talks to Node at /api.
  Node proxies /api calls to Java JDBC on localhost:8080.
*/

const API_BASE = "/api";

const halls = [
  ["Royal Grand Hall","Plain hall • 800 guests",45000,"🏛️"],
  ["Crystal Palace","AC hall • 500 guests",38000,"💎"],
  ["Green Garden Hall","Garden venue • 700 guests",55000,"🌿"],
  ["Pearl Banquet","Premium hall • 350 guests",30000,"🏰"],
  ["Lakshmi Convention","Large hall • 1200 guests",70000,"🏛️"],
  ["Sunrise Mini Hall","Small function • 200 guests",18000,"🌅"],
  ["Golden Crown Hall","Wedding hall • 600 guests",52000,"👑"],
  ["Lotus Celebration Hall","AC • 450 guests",42000,"🪷"]
];

const chairs = [
  ["Plastic Chair Pack 100","100 chairs",4000,"🪑"],
  ["Banquet Chair Pack 100","100 padded chairs",7500,"💺"],
  ["Royal Chair Pack 100","Cushioned premium chairs",12000,"👑"],
  ["Chiavari Chair Pack 100","Elegant wedding chairs",15000,"✨"],
  ["White Cover Chair 100","White covers included",8000,"🤍"],
  ["Gold Chair 100","Gold finish chairs",14000,"🌟"],
  ["VIP Sofa Seating","10 sofa sets",18000,"🛋️"],
  ["Kids Chair Pack 50","50 colorful chairs",2500,"🧒"]
];

const decor = [
  ["Classic Stage Decor","Backdrop + flowers + lights",18000,"🌸"],
  ["Royal Wedding Decor","Premium stage + floral setup",35000,"👑"],
  ["Floral Entrance","Fresh-style floral entrance",12000,"🌺"],
  ["LED Stage Package","LED wall + stage lights",28000,"💡"],
  ["Mandap Decoration","Traditional mandap setup",25000,"🛕"],
  ["Reception Backdrop","Elegant reception backdrop",14000,"✨"],
  ["Balloon Decoration","Theme balloon package",8000,"🎈"],
  ["Premium Table Decor","Centerpieces + table styling",16000,"🍽️"]
];

const vegNames = [
"Paneer Butter Masala","Kadai Paneer","Palak Paneer","Shahi Paneer","Veg Biryani",
"Jeera Rice","Gobi Manchurian","Veg Noodles","Masala Dosa","Idli Sambar","Medu Vada",
"Chole Bhature","Dal Tadka","Dal Makhani","Aloo Gobi","Veg Kurma","Mushroom Masala",
"Baby Corn Fry","Gobi 65","Vegetable Pulao","Curd Rice","Rasam","Sambar","Chapati"
];

const nonVegNames = [
"Chicken Biryani","Mutton Biryani","Chicken 65","Chicken Tikka","Butter Chicken",
"Chicken Curry","Mutton Curry","Mutton Fry","Fish Fry","Fish Curry","Prawn Masala",
"Prawn Fry","Chicken Kebab","Chicken Lollipop","Tandoori Chicken","Egg Curry",
"Egg Biryani","Pepper Chicken","Chilli Chicken","Chicken Manchurian","Mutton Biryani Special",
"Fish Tikka","Chicken Chettinad","Mutton Korma"
];

const icons = ["🍛","🍲","🥘","🍚","🍜","🥗","🍽️","🌶️"];
const veg = vegNames.map((n,i)=>[n,"Catering portion • vegetarian",120+i*5,icons[i%icons.length]]);
const nonveg = nonVegNames.map((n,i)=>[n,"Catering portion • non-vegetarian",180+i*8,["🍗","🍖","🐟","🍤"][i%4]]);

let cart = JSON.parse(localStorage.getItem("hallbookCart") || "[]");

function money(v){ return "₹" + Number(v).toLocaleString("en-IN"); }

function save(){
  localStorage.setItem("hallbookCart", JSON.stringify(cart));
  updateCount();
  renderCart();
}

function updateCount(){
  const e = document.getElementById("cartCount");
  if(e) e.textContent = cart.reduce((s,x)=>s+x.qty,0);
}

function safeText(value){
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function addItem(name,price,icon,type="SERVICE"){
  const numericPrice = Number(price);
  const p = cart.find(x=>x.name===name);
  if(p) p.qty++;
  else cart.push({
    name,
    price:numericPrice,
    qty:1,
    icon,
    itemType:type
  });
  save();
  toast("Added " + name);
}

function removeItem(i){
  const row=document.querySelectorAll(".cart-row")[i];
  if(row) row.classList.add("removing");
  setTimeout(()=>{
    cart.splice(i,1);
    save();
  },280);
}

function changeQty(i,d){
  if(!cart[i]) return;
  cart[i].qty += d;
  if(cart[i].qty<=0) return removeItem(i);
  save();
}

function toast(text){
  const x=document.createElement("div");
  x.className="toast";
  x.textContent=text;
  document.body.appendChild(x);
  setTimeout(()=>x.remove(),1300);
}

function cards(data,id,type="SERVICE"){
  const el=document.getElementById(id);
  if(!el) return;
  el.innerHTML=data.map(p=>`
    <article class="product">
      <div class="pic">${safeText(p[3])}</div>
      <div class="product-body">
        <h3>${safeText(p[0])}</h3>
        <p>${safeText(p[1])}</p>
        <span class="price">${money(p[2])}</span>
        <button class="add" onclick='addItem(${JSON.stringify(p[0])},${Number(p[2])},${JSON.stringify(p[3])},${JSON.stringify(type)})'>+ Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function showFood(type,btn){
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  if(btn) btn.classList.add("active");
  cards(type==="veg" ? veg : nonveg,"foodGrid","FOOD");
}

function renderCart(){
  const el=document.getElementById("cartItems");
  if(!el) return;

  if(!cart.length){
    el.innerHTML='<p class="empty">Your cart is empty. Add a hall, chairs, decoration or food item.</p>';
    const t=document.getElementById("total");
    if(t)t.textContent="₹0";
    return;
  }

  el.innerHTML=cart.map((x,i)=>`
    <div class="cart-row">
      <span>${safeText(x.icon)} <b>${safeText(x.name)}</b><br>
      <small>${money(x.price)} × ${x.qty}</small></span>
      <span class="qty">
        <button onclick="changeQty(${i},-1)">−</button>
        ${x.qty}
        <button onclick="changeQty(${i},1)">+</button>
        <button class="remove" onclick="removeItem(${i})">Remove</button>
      </span>
    </div>
  `).join("");

  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const totalEl=document.getElementById("total");
  if(totalEl) totalEl.textContent=money(total);
}

function showSuccessModal(bookingId, demoMode=false){
  const modal=document.getElementById("successModal");
  if(!modal) return;

  modal.classList.remove("hidden");
  modal.innerHTML=`
    <div class="success-card">
      <div class="success-circle">✓</div>
      <h2>${demoMode ? "Booking Successful!" : "Booking Confirmed!"}</h2>
      <p>${demoMode
        ? "Your demo booking was saved in this browser. Start the Java JDBC server to save it permanently in MySQL."
        : "Your booking, booking items and payment record were saved successfully."}</p>
      <div class="booking-id">Booking ID: ${safeText(bookingId)}</div>
      <button class="btn full" onclick="closeSuccess()">Continue</button>
    </div>
  `;
}

function closeSuccess(){
  const modal=document.getElementById("successModal");
  if(modal) modal.classList.add("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}

function setTodayMin(){
  const input=document.getElementById("eventDate");
  if(!input) return;
  const today=new Date();
  const y=today.getFullYear();
  const m=String(today.getMonth()+1).padStart(2,"0");
  const d=String(today.getDate()).padStart(2,"0");
  input.min=`${y}-${m}-${d}`;
}

async function placeOrder(event){
  if(event) event.preventDefault();

  const msg=document.getElementById("orderMsg");
  if(!cart.length){
    msg.className="message err";
    msg.textContent="Add at least one item to the cart.";
    return;
  }

  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const date=document.getElementById("eventDate").value;
  const payment=document.getElementById("payment").value;

  if(!name || !phone || !date){
    msg.className="message err";
    msg.textContent="Please fill name, phone and function date.";
    return;
  }

  if(!/^[0-9]{10}$/.test(phone)){
    msg.className="message err";
    msg.textContent="Please enter a valid 10 digit phone number.";
    return;
  }

  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const payload={
    customerName:name,
    phone,
    eventDate:date,
    payment,
    total,
    items:cart.map(x=>({
      name:x.name,
      price:x.price,
      qty:x.qty,
      itemType:x.itemType || "SERVICE"
    }))
  };

  const button=event?.submitter || document.querySelector("#bookingForm button[type=submit]");
  if(button){
    button.disabled=true;
    button.textContent="Saving Booking...";
  }

  msg.className="message";
  msg.textContent="Saving booking...";

  try{
    const response=await fetch(API_BASE+"/bookings",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });

    const data=await response.json().catch(()=>({message:"Invalid server response"}));

    if(!response.ok){
      throw new Error(data.message || "Booking server error");
    }

    cart=[];
    save();
    msg.className="message ok";
    msg.textContent="Booking saved successfully.";
    showSuccessModal(data.bookingId || "HB-DEMO",false);
    document.getElementById("bookingForm")?.reset();
  }catch(error){
    /*
      This fallback is intentional for a student demo:
      the UI still demonstrates a successful booking flow when
      Java/MySQL is not running. It does NOT claim that MySQL was updated.
    */
    const demoId="HB-DEMO-"+Math.random().toString(36).slice(2,8).toUpperCase();
    localStorage.setItem("hallbookLastDemoBooking",JSON.stringify({
      bookingId:demoId,customerName:name,phone,eventDate:date,payment,total,items:payload.items,createdAt:new Date().toISOString()
    }));

    cart=[];
    save();
    msg.className="message ok";
    msg.textContent="Demo booking successful. Java JDBC server was not reachable.";
    showSuccessModal(demoId,true);
  }finally{
    if(button){
      button.disabled=false;
      button.textContent="Confirm Booking";
    }
  }
}

function setupBookingForm(){
  const form=document.getElementById("bookingForm");
  if(form) form.addEventListener("submit",placeOrder);
  setTodayMin();
}

async function loadDatabaseCatalog(){
  /*
    If Java/JDBC is running, replace fallback catalog with MySQL data.
    If it is not running, the static catalog remains visible.
  */
  try{
    const [h,c,d]=await Promise.all([
      fetch(API_BASE+"/halls").then(r=>r.ok?r.json():Promise.reject()),
      fetch(API_BASE+"/chairs").then(r=>r.ok?r.json():Promise.reject()),
      fetch(API_BASE+"/decorations").then(r=>r.ok?r.json():Promise.reject())
    ]);

    if(Array.isArray(h) && document.getElementById("hallGrid"))
      cards(h.map(x=>[x.name,x.description+" • "+x.capacity+" guests",Number(x.price),"🏛️"]),"hallGrid","HALL");

    if(Array.isArray(c) && document.getElementById("chairGrid"))
      cards(c.map(x=>[x.name,x.description,Number(x.price),"🪑"]),"chairGrid","CHAIR");

    if(Array.isArray(d) && document.getElementById("decorGrid"))
      cards(d.map(x=>[x.name,x.description,Number(x.price),"🌸"]),"decorGrid","DECORATION");

    if(document.getElementById("foodGrid")){
      const type=document.querySelector(".tab.active")?.textContent.includes("Non")?"NON_VEG":"VEG";
      const data=await fetch(API_BASE+"/food?type="+type).then(r=>r.ok?r.json():Promise.reject());
      if(Array.isArray(data))
        cards(data.map(x=>[x.name,x.description,Number(x.price),type==="VEG"?"🥗":"🍗"]),"foodGrid","FOOD");
    }
  }catch(e){
    // Keep frontend fallback products.
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  updateCount();
  cards(halls,"hallGrid","HALL");
  cards(chairs,"chairGrid","CHAIR");
  cards(decor,"decorGrid","DECORATION");
  if(document.getElementById("foodGrid")) showFood("veg",document.querySelector(".tab"));
  renderCart();
  setupBookingForm();
  setTimeout(loadDatabaseCatalog,250);
});
