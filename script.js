document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // КНОПКА СКРЫТИЯ САЙДБАРА
    // =================================

    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle");

    if (sidebar && sidebarToggle) {

        sidebarToggle.addEventListener("click", function () {

            const isHidden = sidebar.classList.toggle("hidden");

            if (isHidden) {

                sidebarToggle.classList.add("sidebar-hidden");

                sidebarToggle.textContent = "☰";

                sidebarToggle.setAttribute(
                    "aria-label",
                    "Показать панель"
                );

            } else {

                sidebarToggle.classList.remove("sidebar-hidden");

                sidebarToggle.textContent = "✕";

                sidebarToggle.setAttribute(
                    "aria-label",
                    "Скрыть панель"
                );
            }

        });

    }

    // =================================
    // УНИВЕРСАЛЬНАЯ СИСТЕМА МОДАЛЬНЫХ ОКОН
    // =================================

    const modals = [];

    function setupModal({ triggers, windowSelector, closeSelector, overlaySelector }) {

        const windowEl = document.querySelector(windowSelector);
        const overlayEl = document.querySelector(overlaySelector);
        const closeEl = document.querySelector(closeSelector);

        if (!windowEl || !overlayEl || !closeEl) return;

        function open() {
            closeAllModals();
            windowEl.classList.add("active");
            overlayEl.classList.add("active");
            windowEl.setAttribute("aria-hidden", "false");
        }

        function close() {
            windowEl.classList.remove("active");
            overlayEl.classList.remove("active");
            windowEl.setAttribute("aria-hidden", "true");
        }

        // Кнопки/ссылки, открывающие это окно (их может быть несколько)
        document.querySelectorAll(triggers).forEach(function (trigger) {
            trigger.addEventListener("click", open);

            // Открытие по Enter/Space при фокусе с клавиатуры
            trigger.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                }
            });
        });

        closeEl.addEventListener("click", close);
        overlayEl.addEventListener("click", close);

        modals.push({ windowEl, close });
    }

    function closeAllModals() {
        modals.forEach(function (modal) {
            modal.close();
        });
    }

    // Закрытие по Escape — самое верхнее открытое окно
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeAllModals();
        }
    });

    // Регистрируем все окна сайта
    setupModal({
        triggers: ".menu-button, .menu-nav-button",
        windowSelector: ".cafe-menu",
        closeSelector: ".close-menu",
        overlaySelector: ".menu-overlay"
    });

    setupModal({
        triggers: ".about-nav-button",
        windowSelector: ".about-window",
        closeSelector: ".close-about",
        overlaySelector: ".about-overlay"
    });

    setupModal({
        triggers: ".gallery-nav-button",
        windowSelector: ".gallery-window",
        closeSelector: ".close-gallery",
        overlaySelector: ".gallery-overlay"
    });

    setupModal({
        triggers: ".contacts-nav-button",
        windowSelector: ".contacts-window",
        closeSelector: ".close-contacts",
        overlaySelector: ".contacts-overlay"
    });


    // =================================
    // КОРЗИНА ЗАКАЗА
    // =================================

    const coffeeItems = document.querySelectorAll(".coffee");
    const cartTotalEl = document.querySelector(".cart-total");
    const cartTimeEl = document.querySelector(".cart-time");
    const cartNoteEl = document.querySelector(".cart-note");

    // Количество по каждой позиции, ключ — название блюда
    const cart = {};

    coffeeItems.forEach(function (item) {

        const name = item.dataset.name;
        const price = parseInt(item.dataset.price, 10);

        const minusBtn = item.querySelector(".minus");
        const plusBtn = item.querySelector(".plus");
        const qtyEl = item.querySelector(".qty-value");

        cart[name] = { price: price, qty: 0 };

        plusBtn.addEventListener("click", function () {
            cart[name].qty++;
            qtyEl.textContent = cart[name].qty;
            updateCart();
        });

        minusBtn.addEventListener("click", function () {
            if (cart[name].qty > 0) {
                cart[name].qty--;
                qtyEl.textContent = cart[name].qty;
                updateCart();
            }
        });
    });

    function updateCart() {

        let total = 0;
        let itemsCount = 0;

        for (const name in cart) {
            total += cart[name].price * cart[name].qty;
            itemsCount += cart[name].qty;
        }

        if (itemsCount === 0) {
            cartTotalEl.textContent = "0 ₸";
            cartTimeEl.textContent = "—";
            cartNoteEl.textContent = "Корзина пуста — выберите что-нибудь вкусное";
            return;
        }

        cartTotalEl.textContent = total + " ₸";

        // Примерное время ожидания: 5 минут база + 2 минуты за каждую
        // позицию сверх первой (условная оценка загрузки кухни)
        const waitTime = 5 + (itemsCount - 1) * 2;
        cartTimeEl.textContent = "~" + waitTime + " мин";

        cartNoteEl.textContent = itemsCount === 1
            ? "1 позиция в заказе"
            : itemsCount + " позиций в заказе";
    }


    // =================================
    // ЛЕТАЮЩИЕ ЛЕПЕСТКИ
    // =================================

    const petalsContainer = document.querySelector(".petals");

    // Пара цветовых пар для лепестков — чуть разные оттенки розы
    const petalColors = [
        ["#ffc2e0", "#d63384"],
        ["#ffb6d9", "#b3245e"],
        ["#ffd6e9", "#e0559c"]
    ];

    let petalId = 0;

    function createPetal() {

        const petal = document.createElement("div");
        petal.classList.add("petal");

        const size = Math.random() * 14 + 14; // 14–28px
        const duration = Math.random() * 6 + 6;
        const [colorStart, colorEnd] = petalColors[
            Math.floor(Math.random() * petalColors.length)
        ];

        petal.style.left = Math.random() * 100 + "vw";
        petal.style.width = size + "px";
        petal.style.height = (size * 1.3) + "px";
        petal.style.animationDuration = duration + "s";

        petalId++;

        // Форма лепестка розы: закруглённая капля, заданная SVG-путём,
        // залитая градиентом от светло-розового к малиновому
        petal.innerHTML =
            '<svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">' +
                '<defs>' +
                    '<linearGradient id="petalGrad' + petalId + '" x1="0" y1="0" x2="1" y2="1">' +
                        '<stop offset="0%" stop-color="' + colorStart + '"/>' +
                        '<stop offset="100%" stop-color="' + colorEnd + '"/>' +
                    '</linearGradient>' +
                '</defs>' +
                '<path d="M12 0C12 0 24 11 23 20C22 27 17.5 32 12 32C6.5 32 2 27 1 20C0 11 12 0 12 0Z" ' +
                    'fill="url(#petalGrad' + petalId + ')"/>' +
            '</svg>';

        petalsContainer.appendChild(petal);

        setTimeout(function () {
            petal.remove();
        }, duration * 1000);
    }

    setInterval(createPetal, 500);

});
