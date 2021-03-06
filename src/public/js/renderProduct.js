function renderProduct({
    titleTable = null,
    filter = true,
    filterNumber = 'all',
    numberProduct = 8,
    sort = true,
}) {
    const api = `/api/product`;

    function start() {getProduct(renderView)
    }
    start();

    function renderView(products) {
        if (sort) products.sort((a, b) => b.bought - a.bought);
        let count = 1;
        const html = products.map((product, index) => {
            if (
                filter &&
                product.classify == filterNumber &&
                count <= numberProduct
            ) {
                count++;
                return `
                <div class="col-sm-6 col-md-6 col-lg-4 col-xl-3 mt-3">
                        <div class="card-product bg-dark-img">
                            <div class="card-product__img ratio-box fade-box">
                            <img class="img-inside lazyload" data-src="${
                                    product.image
                                }" alt="">
                                <div class="info-product">
                                    <a href="/seemore/${
                                        product.slug
                                    }"><i class="far fa-eye"></i></a>
                                </div>
                            </div>
                            <div class="card-product__star">
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                            </div>
                            <div class="card-product__classify">
                                ${product.classify}
                            </div>
                            <div class="card-product__name-product">
                                ${product.productname}
                            </div>
                            <div class="card-product__price-product">
                                ${Number(product.price).toLocaleString(
                                    'es-AR',
                                )} VN??
                            </div>
                            <div class="card-product__footer">
                                <div class="sold"></i> ???? b??n ${
                                    product.bought
                                } <i class="fas fa-truck"></i></div>
                                <div class="available ${product.available>0?'':'active'}">
                                    ${product.available>0?'C??n h??ng':'H???t h??ng'}
                                </div>
                            </div>
                            <div class="card-product-action">
                                <a class="btn-buy-now" ${product.available>0?`href="/buyer/${
                                    product.slug
                                }/buy"`:`onclick="outOfStock()"`}>
                                    Mua ngay
                                </a>
                                <a class="btn-mobile-see" href="/seemore/${
                                    product.slug
                                }">Xem chi ti???t</a>
                                <div class="btn-add-to-cart" onclick="addCart('${
                                    product.slug
                                }')">
                                    Th??m v??o gi??? h??ng
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (filter == false && count <= numberProduct) {
                count++;
                return `
                    <div class="col-sm-6 col-md-6 col-lg-4 col-xl-3 mt-3">
                        <div class="card-product bg-dark-img">
                            <div class="ribbon">M???i</div>
                            <div class="card-product__img">
                                <img class="img-inside lazyload" data-src="${
                                    product.image
                                }" alt="">
                                <div class="info-product">
                                    <a href="/seemore/${
                                        product.slug
                                    }"><i class="far fa-eye"></i></a>
                                    <div class="note-title">
                                        Xem chi ti???t
                                    </div>
                                </div>
                            </div>
                            <div class="card-product__star">
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                                <span class="text-warning"><i class="fas fa-star"></i></span>
                            </div>
                            <div class="card-product__classify">
                                ${product.classify}
                            </div>
                            <div class="card-product__name-product">
                                ${product.productname}
                            </div>
                            <div class="card-product__price-product">
                                ${Number(product.price).toLocaleString(
                                    'es-AR',
                                )} VN??
                            </div>
                            <div class="card-product__footer">
                                <div class="sold"></i> ???? b??n ${
                                    product.bought
                                } <i class="fas fa-truck"></i></div>
                                <div class="available ${product.available>0?'':'active'}">
                                    ${product.available>0?'C??n h??ng':'H???t h??ng'}
                                </div>
                            </div>
                            <div class="card-product-action">
                                <a class="btn-buy-now" ${product.available>0?`href="/buyer/${
                                    product.slug
                                }/buy"`:`onclick="outOfStock()"`}>
                                    Mua ngay
                                </a>
                                <a class="btn-mobile-see" href="/seemore/${
                                    product.slug
                                }">Xem chi ti???t</a>
                                <div class="btn-add-to-cart" onclick="addCart('${
                                    product.slug
                                }')">
                                    Th??m v??o gi??? h??ng
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
            }
        });
        const productsHtml = document.createElement('div');
        const title = `<div class="title">${titleTable||filterNumber}</div>`;
        productsHtml.classList.add('products');
        productsHtml.innerHTML = `
            ${title} 
            <div class="row">${html.join('')}</div>
            <div class="see-more-product"> <a href="/danhmuc/${filterNumber}">Xem th??m</a> </div>
            `;
        const main = document.querySelector('#render-product');
        if (main) {
            if (count > 1) {
                main.appendChild(productsHtml);
            }
        }
    }

    function getProduct(callback) {
        fetch(api)
            .then((response) => response.json())
            .then(callback)
    }
}
