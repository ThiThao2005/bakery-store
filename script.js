/* ============================================================
   1. KHỞI TẠO DỮ LIỆU & GIỎ HÀNG
   ============================================================ */
const images = [
  "https://cdn.tgdd.vn/2021/10/CookRecipe/Avatar/banh-kem-socola-hinh-trai-tim-thumbnail-1.jpg",
  "https://i.ytimg.com/vi/cFPK54h_gfQ/maxresdefault.jpg",
  "https://i.ytimg.com/vi/-Su5GTZSh8Y/maxresdefault.jpg"
];

const allProducts = [
  { name: "Fruit Cakes", price: 25, img: "https://i.pinimg.com/originals/5b/14/f8/5b14f821cb2f2a5cd29695742dd26866.jpg" },
  { name: "Donut", price: 5, img: "https://tse3.mm.bing.net/th/id/OIP.lI5oPL_P4agbdJkixbqi1AHaEJ" },
  { name: "Sparkle Cake", price: 15, img: "https://tse4.mm.bing.net/th/id/OIP.DffvukzfdtNeV63LaPRrGAHaE8" },
  { name: "Nutella Cake", price: 12, img: "https://cdn.tgdd.vn/2021/10/CookRecipe/Avatar/banh-kem-socola-hinh-trai-tim-thumbnail-1.jpg" },
  { name: "Strawberry Cake", price: 30, img: "https://cdn.tgdd.vn/2020/09/CookProduct/1260-1200x676-67.jpg" },
  { name: "Choco Cup", price: 7, img: "https://banhkemcaocap.com/wp-content/uploads/2019/10/banh-cupcake-kem-bo-mau-vang-trang-tri-trai-cay-tuoi.jpg" }
];

let index = 0;
// Giỏ hàng lưu trữ dạng mảng các đối tượng {name, price, quantity}
let cart = JSON.parse(localStorage.getItem("cartData")) || [];

/* ============================================================
   2. KHI TRANG LOAD XONG
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  updateCartIcon();
  setInterval(next, 4000); // Tự động chạy Slider
  renderProducts(allProducts); // Hiển thị sản phẩm trong Modal View All
});

/* ============================================================
   3. CHỨC NĂNG SLIDER
   ============================================================ */
function showSlide() {
  const slideImg = document.getElementById("slideImg");
  if (!slideImg) return;
  slideImg.style.opacity = "0";
  setTimeout(() => {
    slideImg.src = images[index];
    slideImg.style.opacity = "1";
  }, 300);
}

function next() { index = (index + 1) % images.length; showSlide(); }
function prev() { index = (index - 1 + images.length) % images.length; showSlide(); }

/* ============================================================
   4. QUẢN LÝ GIỎ HÀNG CHI TIẾT
   ============================================================ */
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }
  saveCart();
  
  // Hiệu ứng nảy icon giỏ hàng
  const cartIcon = document.getElementById("cart-count").parentElement;
  cartIcon.style.transform = "scale(1.3)";
  setTimeout(() => cartIcon.style.transform = "scale(1)", 200);
}

function changeQuantity(name, delta) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
    saveCart();
    openCheckout(); // Cập nhật lại giao diện modal ngay lập tức
  }
}

function removeItem(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  if (cart.length === 0) closeCheckout();
  else openCheckout();
}

function saveCart() {
  localStorage.setItem("cartData", JSON.stringify(cart));
  updateCartIcon();
}

function updateCartIcon() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartDisplay = document.getElementById("cart-count");
  if (cartDisplay) cartDisplay.innerText = totalQty;
}

/* ============================================================
   5. MODAL TẤT CẢ SẢN PHẨM & BỘ LỌC
   ============================================================ */
function openViewAll(e) {
  if (e) e.preventDefault();
  document.getElementById("product-modal").style.display = "block";
  renderProducts(allProducts);
}

function closeViewAll() { document.getElementById("product-modal").style.display = "none"; }

function renderProducts(productsToDisplay) {
  const container = document.getElementById("full-product-list");
  if (!container) return;
  container.innerHTML = productsToDisplay.map(prod => `
    <div class="card">
      <img src="${prod.img}">
      <p class="product-name">${prod.name}</p>
      <p class="price">$${prod.price}</p>
      <button onclick="addToCart('${prod.name}', ${prod.price})">Add to cart</button>
    </div>
  `).join('');
}

function filterProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const priceLimit = document.getElementById("priceFilter").value;
  const filtered = allProducts.filter(prod => {
    const matchesName = prod.name.toLowerCase().includes(searchTerm);
    const matchesPrice = (priceLimit === "all") || (prod.price <= parseInt(priceLimit));
    return matchesName && matchesPrice;
  });
  renderProducts(filtered);
}

/* ============================================================
   6. THANH TOÁN (CHECKOUT MODAL)
   ============================================================ */
function openCheckout() {
  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }

  const listContainer = document.getElementById("cart-details-list");
  const summaryCount = document.getElementById("summary-count");
  const summaryTotal = document.getElementById("summary-total");
  
  listContainer.innerHTML = ""; 
  let totalQty = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalQty += item.quantity;
    totalPrice += (item.price * item.quantity);
    listContainer.innerHTML += `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
        <div style="flex: 1;">
            <span style="display: block; font-weight: bold;">${item.name}</span>
            <span style="color: #e91e63; font-size: 14px;">$${item.price * item.quantity}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" onclick="changeQuantity('${item.name}', -1)" style="width: 25px; height: 25px; cursor: pointer; border: 1px solid #ddd; background: #fff;">-</button>
            <span style="min-width: 20px; text-align: center; font-weight: bold;">${item.quantity}</span>
            <button type="button" onclick="changeQuantity('${item.name}', 1)" style="width: 25px; height: 25px; cursor: pointer; border: 1px solid #ddd; background: #fff;">+</button>
            <i class="fas fa-trash-alt" onclick="removeItem('${item.name}')" style="color: #aaa; cursor: pointer; margin-left: 10px; font-size: 14px;"></i>
        </div>
      </div>
    `;
  });

  if (summaryCount) summaryCount.innerText = totalQty;
  if (summaryTotal) summaryTotal.innerText = "$" + totalPrice;
  document.getElementById("checkout-modal").style.display = "block";
}

function closeCheckout() { document.getElementById("checkout-modal").style.display = "none"; }

function processOrder(event) {
  event.preventDefault();
  alert(`🎉 Cảm ơn bạn! Đơn hàng đã được hệ thống ghi nhận thành công.`);
  cart = []; 
  saveCart();
  closeCheckout();
}

/* ============================================================
   7. ACTIVE MENU
   ============================================================ */
document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", function() {
    document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
    this.classList.add("active");
  });
});