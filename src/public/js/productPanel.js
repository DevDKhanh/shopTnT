(function () {
    socket.emit('get-data-products');

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const mainPanel = $('.admin-panel');
    const wait = $('.wait-handle');

    let btnAddProduct;
    let btnBack;
    let btnSave;
    let arrayProducts = [];

    const findElement = {
        products: function () {
            btnAddProduct = $('.btn-add-prd');
        },
        addProduct: function () {
            btnSave = $('.btn-save');
            btnBack = $('.btn-back');
        },
    };

    const renderProductPanel = {
        viewMain: function () {
            const htmlProduct = arrayProducts.map((data) => {
                return `
                    <div class="col-sm-6 col-md-6 col-xl-3">
                    <div class="card-product-panel">
                        <div class="card-product-panel__img">
                            <img src="${data.image}" alt="">
                        </div>
                        <div class="card-product-panel__classify">
                           Danh mục: ${data.classify}
                        </div>
                        <div class="card-product-panel__name">
                           Tên: ${data.productname}
                        </div>
                        <div class="card-product-panel__name">
                           Bảo hành: ${data.productWarranty}
                        </div>
                        <div class="card-product-panel__name">
                           Kho: ${data.available}
                        </div>
                        <div class="card-product-panel__price">
                            ${Number(data.price).toLocaleString('en-US')} VNĐ
                        </div>
                        <div class="card-product-panel__actions">
                            <div class="btn btn-success btn-edit" data-id="${
                                data._id
                            }">
                               <i class="fas fa-edit"></i> Chỉnh sửa
                            </div>
                            <div class="btn btn-danger btn-del" data-id="${
                                data._id
                            }">
                               <i class="far fa-trash-alt"></i> Xóa
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            mainPanel.innerHTML = `
            <div class="layout-panel">
            <div class="chart">
                <div class="row">
                    <div class="col-md-6">
                        <div class="chart-card bg-line-g-1">
                            <div class="text">
                                <div class="chart-card__name">Tổng khách hàng</div>
                                <div class="chart-card__number">200</div>
                                <div class="chart-card__last-week">tăng 4% so với tuần trước</div>
                            </div>
                            <div class="icon">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="chart-card bg-line-g-2">
                            <div class="text">
                                <div class="chart-card__name">Thu nhập</div>
                                <div class="chart-card__number">1.000.000</div>
                                <div class="chart-card__last-week">tăng 4% so với tuần trước</div>
                            </div>
                            <div class="icon">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="chart-card bg-line-g-3">
                            <div class="text">
                                <div class="chart-card__name">Số đơn hàng đã bán</div>
                                <div class="chart-card__number">50</div>
                                <div class="chart-card__last-week">tăng 4% so với tuần trước</div>
                            </div>
                            <div class="icon">
                            <i class="fas fa-chart-area"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="chart-card bg-line-g-4">
                            <div class="text">
                                <div class="chart-card__name">Số người truy cập</div>
                                <div class="chart-card__number">200</div>
                                <div class="chart-card__last-week">tăng 4% so với tuần trước</div>
                            </div>
                            <div class="icon">
                                <i class="fas fa-chart-area"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="products-panel">
            <div class="actions-contrrol">
                <div class="actions-contrrol__btn bg-primary btn-add-prd">
                   <i class="fas fa-plus-square"></i> Sản phẩm mới
                </div>
                <div class="actions-contrrol__btn bg-danger btn-trash-prd ml-1">
                   <i class="fas fa-trash"></i>
                </div>
                <div class="actions-contrrol__search">
                    <div class="actions-contrrol__search-input">
                        <button><i class="fas fa-search"></i></button>
                        <input type="text" placeholder="Nhập tên sản phẩm muốn tìm">
                    </div>
                    <div class="sort">
                        <select name="" id="">
                            <option value="">Tất cả</option>
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                        </select>
                        <button>
                            Sắp xếp
                        </button>
                    </div>
                </div>
            </div>
            <div class="products-panel-list">
                <div class="row">
                    ${htmlProduct.join('')}
                </div>
                <div class="pagination">
                    <div class="page active">
                        1
                    </div>
                    <div class="page">
                        2
                    </div>
                    <div class="page">
                        3
                    </div>
                    <div class="page">
                        4
                    </div>
                    <div class="page more">
                        ...
                    </div>
                    <div class="page">
                        20
                    </div>
                    <div class="page">
                        21
                    </div>
                </div>
            </div>
        </div>
        `;
        },
        event: function () {
            const _this = this;

            socket.on('send-data-client', (data) => {
                arrayProducts = [];
                data.map((value) => {
                    if (value.status == 'active') arrayProducts.push(value);
                });
                _this.viewMain();
                findElement.products();
                _this.handle();
            });
        },
        handle: function () {
            const _this = this;

            btnAddProduct.onclick = function () {
                renderAddProduct.start();
            };

            const btnEdit = $$('.btn-edit');
            btnEdit.forEach((element) => {
                element.onclick = () => {
                    socket.emit('edit-product', element.dataset.id);
                    renderEditProduct.start();
                };
            });

            const btnDel = $$('.btn-del');
            btnDel.forEach((element) => {
                element.onclick = () => {
                    dialog({
                        title: 'Bạn có muốn xóa sản phẩm này',
                        textBtn: 'Xóa ngay',
                        action: function () {
                            ajaxCall({
                                method: 'PUT',
                                url: `/admin/trash/${element.dataset.id}`,
                                success: function (data) {
                                    Toast({
                                        title: 'Thông tin',
                                        message:
                                            'Bạn đã chuyển sản phẩm vào thùng rác',
                                        type: 'info',
                                        duration: 3000,
                                    });
                                    arrayProducts = [];
                                    JSON.parse(data).map((value) => {
                                        if (value.status == 'active')
                                            arrayProducts.push(value);
                                    });
                                    _this.viewMain();
                                    findElement.products();
                                    _this.handle();
                                },
                                error: function (error) {
                                    Toast({
                                        title: 'Lỗi',
                                        message: `Đã xảy ra lỗi - ${error}`,
                                        type: 'error',
                                        duration: 2000,
                                    });
                                },
                            });
                        },
                    });
                };
            });

            const btnTrash = $('.btn-trash-prd');
            btnTrash.onclick = () => {
                renderTrashProduct.start();
            };
        },
        start: function () {
            this.event();
        },
    };
    renderProductPanel.start();

    const renderAddProduct = {
        viewMain: function () {
            mainPanel.innerHTML = `
            <div class="main-add">
            <div class="table-new-product col-md-9">
            <div class="title">
                Thêm sản phẩm mới
            </div>
            <form id="form-add" class="form-new-product" method="POST" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-7">
                        <div class="form-group">
                            <label for="">Tên sản phẩm</label>
                            <div class="input-group">
                                <input name="productname" class="form-element" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Mô tả</label>
                            <div class="input-group">
                                <textarea name="description" class="form-element" cols="30" rows="10"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Ảnh sản phẩm</label>
                            <div class="upload-img">
                                <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
                                <label class="btn btn-upload" for="select-img">Chọn ảnh để tải lên</label>
                                <input hidden name="image" id="select-img" type="file">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="form-group">
                            <label for="">Giá sản phẩm</label>
                            <div class="input-group">
                                <input name="price" class="form-element" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Danh mục sản phẩm</label>
                            <div class="input-group">
                                <select name="classify" class="form-element">
                                    <option value="laptop">Laptop</option>
                                    <option value="may-tinh-de-ban">Máy tính để bàn</option>
                                    <option value="linh-kien-phu-kien">Linh kiện-phụ kiện</option>
                                    <option value="do-cu">Đồ cũ</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Số lượng sản phẩm</label>
                            <div class="input-group">
                                <input name="available" class="form-element" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Thương hiệu</label>
                            <div class="input-group">
                                <input name="tradeMark" class="form-element" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Bảo hành</label>
                            <div class="input-group">
                                <input name="productWarranty" class="form-element" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="btn btn-secondary btn-back">
                                Trở về
                            </div>
                            <div class="btn btn-primary float-right btn-save">
                                Đăng sản phẩm
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        </div>
        `;
        },
        handle: function () {
            btnBack.onclick = function () {
                socket.emit('get-data-products');
            };

            btnSave.onclick = function () {
                const formAdd = $('#form-add');
                const namePrd = $('input[name="productname"]');
                const descriptionPrd = $('textarea[name="description"]');
                const img = $('input[name="image"]');
                const pricePrd = $('input[name="price"]');
                const classify = $('select[name="classify"]');
                const available = $('input[name="available"]');
                const tradeMark = $('input[name="tradeMark"]');
                const productWarranty = $('input[name="productWarranty"]');

                if (
                    namePrd.value == '' ||
                    descriptionPrd.value == '' ||
                    img.value == '' ||
                    pricePrd.value == '' ||
                    classify.value == '' ||
                    available.value == '' ||
                    tradeMark.value == '' ||
                    productWarranty.value == ''
                ) {
                    Toast({
                        title: 'Cảnh báo',
                        message: 'Nhập đầy đủ nội dung!',
                        type: 'warn',
                        duration: 3000,
                    });
                } else {
                    wait.style.display = 'flex';
                    formAdd.action = '/admin/addProduct';
                    formAdd.submit();
                }
            };
        },
        event: function () {
            const img = $('input[name="image"]');
            img.onchange = () => {
                const preview = $('.upload-img .icon');
                const file = $('input[type=file]').files[0];
                const reader = new FileReader();

                reader.addEventListener(
                    'load',
                    function () {
                        preview.innerHTML = `<img id="img-custom" src="${reader.result}" />`;
                    },
                    false,
                );
                if (file) {
                    reader.readAsDataURL(file);
                }
            };
        },
        start: function () {
            this.viewMain();
            findElement.addProduct();
            this.handle();
            this.event();
        },
    };

    const renderEditProduct = {
        isCalled: false,
        viewMain: function () {
            mainPanel.innerHTML = `
            <div class="main-add">
            <div class="table-new-product col-md-9">
            <div class="title">
                Chỉnh sửa thông tin sản phẩm
            </div>
            <form id="form-add" class="form-new-product" method="POST" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-7">
                        <div class="form-group">
                        <input name="_id" hidden type="text" value="${
                            arrayProducts._id
                        }">
                            <label for="">Tên sản phẩm</label>
                            <div class="input-group">
                                <input name="productname" class="form-element" type="text" value="${
                                    arrayProducts.productname
                                }">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Mô tả</label>
                            <div class="input-group">
                                <textarea name="description" class="form-element" cols="30" rows="10">${
                                    arrayProducts.description
                                }</textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Ảnh sản phẩm</label>
                            <div class="upload-img">
                                <div class="icon">
                                    <img src="${
                                        arrayProducts.image
                                    }" id="img-custom"/>
                                </div>
                                <label class="btn btn-upload" for="select-img">Chọn ảnh để tải lên</label>
                                <input hidden name="image" id="select-img" type="file">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="form-group">
                            <label for="">Giá sản phẩm</label>
                            <div class="input-group">
                                <input name="price" class="form-element" type="text" value="${
                                    arrayProducts.price
                                }">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Danh mục sản phẩm</label>
                            <div class="input-group">
                                <select name="classify" class="form-element">
                                    <option value="${arrayProducts.classify}">
                                    ${arrayProducts.classify}
                                    </option>
                                    <option value="laptop">Laptop</option>
                                    <option value="may-tinh-de-ban">Máy tính để bàn</option>
                                    <option value="linh-kien-phu-kien">Linh kiện-phụ kiện</option>
                                    <option value="do-cu">Đồ cũ</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Số lượng sản phẩm</label>
                            <div class="input-group">
                                <input name="available" class="form-element" type="text" value="${
                                    arrayProducts.available
                                }">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Thương hiệu</label>
                            <div class="input-group">
                                <input name="tradeMark" class="form-element" type="text" value="${
                                    arrayProducts.tradeMark
                                }">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Slug</label>
                            <div class="input-group">
                                <input name="slug" class="form-element" type="text" value="${
                                    arrayProducts.slug
                                }">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Bảo hành</label>
                            <div class="input-group">
                                <input name="productWarranty" class="form-element" type="text" value="${
                                    arrayProducts.productWarranty
                                }">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="btn btn-secondary btn-back">
                                Trở về
                            </div>
                            <div class="btn btn-primary float-right btn-save">
                                Cập nhật
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        </div>
        `;
        },
        handle: function () {
            btnBack.onclick = function () {
                socket.emit('get-data-products');
            };

            btnSave.onclick = function () {
                const formAdd = $('#form-add');
                const _id = $('input[name="_id"]');
                const namePrd = $('input[name="productname"]');
                const descriptionPrd = $('textarea[name="description"]');
                const slug = $('input[name="slug"]');
                const pricePrd = $('input[name="price"]');
                const classify = $('select[name="classify"]');
                const available = $('input[name="available"]');
                const tradeMark = $('input[name="tradeMark"]');
                const productWarranty = $('input[name="productWarranty"]');

                if (
                    namePrd.value == '' ||
                    descriptionPrd.value == '' ||
                    pricePrd.value == '' ||
                    classify.value == '' ||
                    available.value == '' ||
                    tradeMark.value == '' ||
                    productWarranty.value == ''
                ) {
                    Toast({
                        title: 'Cảnh báo',
                        message: 'Nhập đầy đủ nội dung!',
                        type: 'warn',
                        duration: 3000,
                    });
                } else {
                    wait.style.display = 'flex';
                    formAdd.action = '/admin/updateProduct?_method=PUT';
                    formAdd.submit();
                }
            };

            const img = $('input[name="image"]');
            img.onchange = () => {
                const preview = $('.upload-img .icon');
                const file = $('input[type=file]').files[0];
                const reader = new FileReader();

                reader.addEventListener(
                    'load',
                    function () {
                        preview.innerHTML = `<img id="img-custom" src="${reader.result}" />`;
                    },
                    false,
                );
                if (file) {
                    reader.readAsDataURL(file);
                }
            };
        },
        event: function () {
            const _this = this;
            socket.on('send-data-edit', (data) => {
                arrayProducts = {};
                arrayProducts = data;
                _this.viewMain();
                findElement.addProduct();
                _this.handle();
            });
        },
        start: function () {
            this.viewMain();
            findElement.addProduct();
            this.handle();
        },
    };
    renderEditProduct.event();

    const renderTrashProduct = {
        viewMain: function () {
            if (arrayProducts.length > 0) {
                const htmls = arrayProducts.map((data, index) => {
                    return `
                    <tr>
                        <td>${data.classify}</td>
                        <td>${data.productname}</td>
                        <td><div class="btn btn-danger btn-del" data-id="${data._id}">Xóa vĩnh viễn</div></td>
                        <td><div class="btn btn-success btn-back-up" data-id="${data._id}">Khôi phục</div></td>
                    </tr>
                    `;
                });
                mainPanel.innerHTML = `
            <div class="container pt-3">
                <div class="mt-4"><div class="btn btn-info btn-back"> Về quản lí hàng</div></div>
                <div class="table-responsive-md mt-3">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Danh mục</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmls.join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            `;
            } else {
                mainPanel.innerHTML = `
                <div>
                    <div class="text-center"><h3>Thùng rác đang trống!!</h3></div>
                    <div class="text-center"><div class="btn btn-info btn-back"> Về quản lí hàng</div></div>
                </div>
                <div class="text-center"><img class="col-md-4" src="/img/trash.png"></div>
                `;
            }
        },
        handle: function () {
            const _this = this;

            const btnDel = $$('.btn-del');
            btnDel.forEach((e) => {
                e.onclick = () => {
                    dialog({
                        title: 'Bạn có muốn xóa vĩnh viễn?',
                        textBtn: 'Xóa ngay',
                        action: function () {
                            ajaxCall({
                                method: 'DELETE',
                                url: `/admin/delete-product/${e.dataset.id}`,
                                success: function (data) {
                                    arrayProducts = [];
                                    JSON.parse(data).map((value) => {
                                        if (value.status == 'Delete')
                                            arrayProducts.push(value);
                                    });
                                    _this.viewMain();
                                    _this.handle();

                                    Toast({
                                        title: 'Xóa thành công',
                                        message: 'Đã xóa viễn vĩnh sản phẩm',
                                        type: 'info',
                                        duration: 2000,
                                    });
                                },
                                error: function (error) {
                                    Toast({
                                        title: 'Lỗi',
                                        message: `Đã xảy ra lỗi - ${error}`,
                                        type: 'error',
                                        duration: 2000,
                                    });
                                },
                            });
                        },
                    });
                };
            });

            const btnBackUp = $$('.btn-back-up');
            btnBackUp.forEach((e) => {
                e.onclick = () => {
                    dialog({
                        title: 'Bạn có muốn khôi phục sản phẩm?',
                        type: 'info',
                        textBtn: 'Khôi phục',
                        action: function () {
                            ajaxCall({
                                method: 'PUT',
                                url: `/admin/back-product/${e.dataset.id}`,
                                success: function (data) {
                                    arrayProducts = [];
                                    JSON.parse(data).map((value) => {
                                        if (value.status == 'Delete')
                                            arrayProducts.push(value);
                                    });
                                    _this.viewMain();
                                    _this.handle();

                                    Toast({
                                        title: 'Thành công',
                                        message:
                                            'Đã đưa sản phẩm trở lại gian hàng',
                                        type: 'success',
                                        duration: 2000,
                                    });
                                },
                                error: function (error) {
                                    Toast({
                                        title: 'Lỗi',
                                        message: `Đã xảy ra lỗi - ${error}`,
                                        type: 'error',
                                        duration: 2000,
                                    });
                                },
                            });
                        },
                    });
                };
            });

            const btnBack = $('.btn-back');
            btnBack.onclick = () => {
                socket.emit('get-data-products');
            };
        },
        event: function () {
            const _this = this;
            socket.on('send-data-trash', (data) => {
                arrayProducts = [];
                data.map((value) => {
                    if (value.status == 'Delete') arrayProducts.push(value);
                });
                _this.viewMain();
                _this.handle();
            });

            socket.on('success-back-up', () => {
                Toast({
                    title: 'Thành công',
                    message: 'Đã thêm lại sản phẩm vào gian hàng',
                    type: 'success',
                    duration: 2000,
                });
            });
        },
        start: function () {
            socket.emit('get-data-trash');
        },
    };
    renderTrashProduct.event();
})();
