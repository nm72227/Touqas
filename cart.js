// State management vector tracking inside the runtime lifecycle stack
let globalShoppingBasketMemoryArray = [];
const FIXED_DELIVERY_THRESHOLD_CHARGE = 150;

// Open/Close toggle interface controller actions
function toggleCartDrawerBox() {
    const componentNode = document.getElementById('shopping-cart-drawer-layer');
    if (componentNode.style.display === 'flex') {
        componentNode.style.display = 'none';
    } else {
        componentNode.style.display = 'flex';
        renderActiveBasketInterfaceDOM();
    }
}

// Add Item execution routine pipeline engine
function addProductToCartPipeline(itemNameString, basePriceNumeric) {
    const matchesFoundElement = globalShoppingBasketMemoryArray.find(element => element.title === itemNameString);
    
    if (matchesFoundElement) {
        matchesFoundElement.quantity += 1;
    } else {
        globalShoppingBasketMemoryArray.push({
            title: itemNameString,
            unitPrice: basePriceNumeric,
            quantity: 1
        });
    }
    
    synchronizeCartGlobalStateMetrics();
}

// Internal quantity incremental stepping adjustment functions
function modifyCartItemUnits(itemNameString, modificationStepFactor) {
    const specificElementIndex = globalShoppingBasketMemoryArray.findIndex(element => element.title === itemNameString);
    if (specificElementIndex === -1) return;
    
    globalShoppingBasketMemoryArray[specificElementIndex].quantity += modificationStepFactor;
    
    if (globalShoppingBasketMemoryArray[specificElementIndex].quantity <= 0) {
        globalShoppingBasketMemoryArray.splice(specificElementIndex, 1);
    }
    
    synchronizeCartGlobalStateMetrics();
    renderActiveBasketInterfaceDOM();
}

// Aggregate numerical recalculations updater
function synchronizeCartGlobalStateMetrics() {
    let accumulatedItemCount = 0;
    let computedSubtotalInvoicePrice = 0;
    
    globalShoppingBasketMemoryArray.forEach(itemNode => {
        accumulatedItemCount += itemNode.quantity;
        computedSubtotalInvoicePrice += (itemNode.unitPrice * itemNode.quantity);
    });
    
    // Refresh visual view headers counter badges text content
    document.getElementById('header-cart-badge-count').textContent = accumulatedItemCount;
    
    // Enable or lock down action pipeline button depending on load weights
    const proceedBtnNode = document.getElementById('cart-step-proceed-btn');
    if(proceedBtnNode) {
        proceedBtnNode.disabled = globalShoppingBasketMemoryArray.length === 0;
    }
    
    return { count: accumulatedItemCount, subtotal: computedSubtotalInvoicePrice };
}

// Virtual rendering injector converting tracking vectors to node cards
function renderActiveBasketInterfaceDOM() {
    const listFeedContainer = document.getElementById('cart-items-feed-stack');
    const computedMetrics = synchronizeCartGlobalStateMetrics();
    
    if (globalShoppingBasketMemoryArray.length === 0) {
        listFeedContainer.innerHTML = `<p class="empty-cart-notice-fallback">Your basket is entirely empty. Grab some food!</p>`;
        document.getElementById('cart-invoice-subtotal-val').textContent = "Rs. 0";
        document.getElementById('cart-invoice-grandtotal-val').textContent = "Rs. 0";
        return;
    }
    
    let rawHTMLTemplateAccumulator = "";
    globalShoppingBasketMemoryArray.forEach(node => {
        rawHTMLTemplateAccumulator += `
            <div class="cart-item-node-card">
                <div class="item-meta-details-block">
                    <h4 class="item-node-title-txt">${node.title}</h4>
                    <p class="item-node-price-lbl">Rs. ${(node.unitPrice * node.quantity).toLocaleString()}</p>
                </div>
                <div class="item-node-quantity-controls">
                    <button class="qty-control-btn" onclick="modifyCartItemUnits('${node.title}', -1)">−</button>
                    <span class="qty-display-num">${node.quantity}</span>
                    <button class="qty-control-btn" onclick="modifyCartItemUnits('${node.title}', 1)">+</button>
                </div>
            </div>
        `;
    });
    
    listFeedContainer.innerHTML = rawHTMLTemplateAccumulator;
    
    // Execute calculated template outputs rendering values formatting string maps
    const checkoutGrandTotalVal = computedMetrics.subtotal + FIXED_DELIVERY_THRESHOLD_CHARGE;
    document.getElementById('cart-invoice-subtotal-val').textContent = `Rs. ${computedMetrics.subtotal.toLocaleString()}`;
    document.getElementById('cart-invoice-grandtotal-val').textContent = `Rs. ${checkoutGrandTotalVal.toLocaleString()}`;
}

// Visibility wizard controller states
function showCheckoutFormStep() {
    document.getElementById('cart-checkout-form-wizard').style.display = 'flex';
}
function hideCheckoutFormStep() {
    document.getElementById('cart-checkout-form-wizard').style.display = 'none';
}

// WhatsApp integration string builder and dispatcher
function executeOrderPayloadDispatcher(eventInstance) {
    eventInstance.preventDefault();
    
    const clientName = document.getElementById('order-cust-name').value;
    const clientPhone = document.getElementById('order-cust-phone').value;
    const clientAddress = document.getElementById('order-cust-address').value;
    const clientEmail = document.getElementById('order-cust-email').value || "N/A";
    const selectedPaymentRoute = document.querySelector('input[name="payment_method_route"]:checked').value;
    
    const metricsSummary = synchronizeCartGlobalStateMetrics();
    const finalBillAmount = metricsSummary.subtotal + FIXED_DELIVERY_THRESHOLD_CHARGE;
    
    // Construct order items block list string text formatting maps
    let orderDescriptionString = "";
    globalShoppingBasketMemoryArray.forEach((node, itemIndex) => {
        orderDescriptionString += `${itemIndex + 1}. ${node.title} (x${node.quantity}) - Rs. ${(node.unitPrice * node.quantity).toLocaleString()}\n`;
    });
    
    // WhatsApp URL template formatting matrix strings
    const targetBusinessPhone = "923001234567"; // 👈 REPLACE THIS WITH YOUR ACTUAL WHATSAPP BUSINESS PHONE NUMBER
    
    const plainTextBodyMessage = `🛍️ *NEW ORDER PLACED - TOUQAS FOODS*\n\n` +
        `👤 *CUSTOMER INFORMATION:*\n` +
        `• *Name:* ${clientName}\n` +
        `• *Phone:* ${clientPhone}\n` +
        `• *Delivery Address:* ${clientAddress}\n` +
        `• *Email:* ${clientEmail}\n\n` +
        `🛒 *ORDER DETAIL SUMMARY:*\n${orderDescriptionString}\n` +
        `💳 *INVOICE BILLING BREAKDOWN:*\n` +
        `• *Subtotal Amount:* Rs. ${metricsSummary.subtotal.toLocaleString()}\n` +
        `• *Delivery Rider Fee:* Rs. ${FIXED_DELIVERY_THRESHOLD_CHARGE}\n` +
        `• 💥 *Total Grand Bill:* Rs. ${finalBillAmount.toLocaleString()}\n\n` +
        `📌 *CHOSEN PAYMENT METHOD:* ${selectedPaymentRoute}\n\n` +
        `Please confirm my order. Thank you!`;
        
    const absoluteEncodedURI = `https://wa.me/${targetBusinessPhone}?text=${encodeURIComponent(plainTextBodyMessage)}`;
    
    // Open targeted browser tab redirection routes safely and purge basket arrays local storage memory
    window.open(absoluteEncodedURI, '_blank');
    globalShoppingBasketMemoryArray = [];
    synchronizeCartGlobalStateMetrics();
    toggleCartDrawerBox();
    hideCheckoutFormStep();
    document.getElementById('active-checkout-form-node').reset();
}
