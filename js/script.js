$(function () {

    //ページ読み込み後に、ゆっくりページを表示する
    $("body").css("display", "none");
    $(window).on("load", function () {
        $('body').delay(200).fadeIn(1000);
    });

    //スクロールボタン最初は消しておく
    $(".scroll-top").hide();

    //クリックされたらページトップへ
    $(".scroll-top").click(function () {
        $('html, body').animate({ scrollTop: 0 });
    });

    //ページトップにいるときは消去する
    $(window).scroll(function () {
        if ($(window).scrollTop() <= 500) {
            $(".scroll-top").hide();
        } else {
            $(".scroll-top").show();
        }
    });

    //ハンバーガーメニューと×ボタン切り替え
    $(".hamburger").click(function () {

        if ($(this).attr("class").indexOf("cross") > -1) { //「×」 → ハンバーガー に変更する場合の処理
            $("body").css("overflow", "visible");

        } else {　　//ハンバーガー → 「×」 に変更する場合の処理
            $("body").css("overflow", "hidden");
        }

        $(".hamburger").toggleClass("cross");
        $(".grobal-navi").toggleClass("change");
        $(".navi-fix").toggleClass("start");
    });

    //ハンバーガーメニューが「✖︎」になった状態で、レスポンシブが解除された場合は、
    //JSで追加したハンバーガー用のレスポンシブ設定も解除する。

    /* 追記：「contact.html」 内の 「.last_check」表示中に以下の動きをされると困るので対処 */

    $(window).resize(function () {
        let w = $(window).width();

        if ((w > 768) && ($('.last_check').css('display') !== 'block')) {
            $(".grobal-navi").removeClass("change");
            $(".hamburger").removeClass("cross");
            $(".navi-fix").removeClass("start");
            $("body").css("overflow", "visible");
        }
    });

    //swiperの設定 (スライド機能のプラグイン)
    var mySwiper = new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 1.5,
        spaceBetween: 20,
        centeredSlides: true,

        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            1480: {
                slidesPerView: 4.6,
            },
            1000: {
                slidesPerView: 3.6,
            },
            768: {
                slidesPerView: 2.6,
            }

        }
    });

    //グローバルナビの子ナビ表示・非表示
    $(".grobal-navi .parent-li").hover(
        function () {
            $(this).children(".grobal-child-navi").show();
        },
        function () {
            $(this).children(".grobal-child-navi").hide();
        });



    //////////////　　ここからチェックボックス動作作成エリア　　//////////////

    //チェックボックスの動き作成
    $(".reccomend label").click(function () {

        if ($(this).attr("class") === "selected") {
            $(this).removeClass("selected");
        } else {
            $(this).addClass("selected");
        }
        return false;
    });

    //チェックボックスのステータス (押される度に更新)
    let checkbox_array = ["no", "no", "no", "no", "no", "no", "no", "no"];
    //セレクトボックスのステータス
    let selectbox_val = "";
    //チェックボックスで選択されたジャンルの、本の名前を全てDBから持ってきて、ここに入れる
    let book_list = [];
    //表示することが確定した本の名前
    let result_list = [];



    //チェックボックスがクリックされた時にチェックボックス配列を更新する
    $(".reccomend .left label").click(function () {
        let select_checkbox = $(this).children(".checkbox").val();
        if (checkbox_array[select_checkbox - 1] === 'yes') {
            checkbox_array[select_checkbox - 1] = 'no';
        } else {
            checkbox_array[select_checkbox - 1] = 'yes';
        }
    });

    //セレクトボックスが更新された時にセレクトボックス変数のステータスを更新
    $(".reccomend .right .select").change(function () {
        selectbox_val = $(this).val();
    });

    //microCMSから、セレクトボックスで選択されたジャンルの本を全て取得
    $(".submit .button").click(function () {
        //クリックされたら一旦配列消去
        book_list.splice(0);
        result_list.splice(0);

        $.ajax({
            url: 'https://book-blog.microcms.io/api/v1/book-list',
            type: 'GET',
            headers: { //microCMS の APIKEY
                'X-API-KEY': 'cb7b6f17-2328-4891-893e-4ad6baa74e22'
            }
        }).then(
            function (data) {
                // チェック入りボックスのvalue値とDBのidを比較して、
                // 一致したらそのIDがもつ本のタイトル配列を全てbook_list配列に代入する
                for (let box = 0; box < checkbox_array.length; box++) { //チェックボックス全配列番号(0〜7)
                    if (checkbox_array[box] === "no") {
                        continue;
                    }
                    for (let db = 0; db < data.contents.length; db++) {  //microcmsの全id(0〜7)
                        let genre = data.contents[db]; //ジャンルオブジェクト

                        if (genre.book_id === box) {
                            for (let element = 0; element < genre.book_title.length; element++) {
                                book_list.push(genre.book_title[element].title);
                            }
                        }
                    }
                }

                for (let i = 1; i <= Number(selectbox_val); i++) {  //表示する本の数
                    let select_book = book_list[intRandom(book_list.length)];  ///ランダムの１冊

                    if (result_list.includes(select_book)) { //表示予定の本と被ってたらやり直し
                        i--;
                    } else {
                        result_list.push(select_book);  //被ってなければ表示予定配列に入れる
                    }
                }
                //本配列を全て出力
                let option_count = $(".reccomend .right .select").children('option').length;
                for (let k = 0; k < option_count; k++) {
                    let temp = ".reccomend .result-area li" + "." + (k + 1);
                    $(temp).text("");  //5冊表示⇒4冊以下表示、みたいな動作に対処する為
                    $(temp).text(result_list[k]);

                }
            });
    });

    function intRandom(max) { //乱数生成
        let rand_temp = Math.floor(Math.random() * max);
        return rand_temp;
    }

    //////////////　　ここまでチェックボックス動作作成エリア　　//////////////


    //////////////　　ページ遷移ボタンの設定　　//////////////　　

    $(".page-selector li").click(function () {

        //選択状態の要素を特定
        let selected = $(".page-selector .selected");

        //クリックされた[li]の要素を特定
        let clicked = $(this).attr("class").trim();

        //選択状態を解除
        $(".page-selector li").removeClass("selected");

        //矢印以外の遷移ボタンが押されたら、それを選択状態にする。
        if (clicked !== "prev" && clicked !== "next") {
            $(this).addClass("selected");
        }

        //矢印がクリックされた時、移動先が矢印以外の場合は、その要素を選択状態にする。矢印だったら現状維持。
        if (clicked === "prev") {
            if (selected.prev().attr("class").indexOf("prev") === -1) {
                selected.prev().addClass("selected");
            } else {
                selected.addClass("selected");
            }
        } else if (clicked === "next") {
            if (selected.next().attr("class").indexOf("next") === -1) {
                selected.next().addClass("selected");
            } else {
                selected.addClass("selected");
            }
        }

        $.ajax({
            url: 'https://book-blog.microcms.io/api/v1/famouse',
            type: 'GET',
            headers: { //microCMS の APIKEY
                'X-API-KEY': 'cb7b6f17-2328-4891-893e-4ad6baa74e22'
            }
        }).then(
            //////  偉人名言のページ遷移設定  //////
            function (data) {
                let human = data.contents[0];
                let left_num = $(".page-selector .selected").index() - 1; //左桁

                for (let i = 0; i <= 9; i++) {
                    let lang_num = String(left_num) + String(i); //左桁と右桁を合体

                    if (lang_num.startsWith("0")) { //先頭が"0"の時は先頭削除
                        lang_num = lang_num.slice("1");
                    }

                    let add_place = ".gift-list .item-" + i;

                    //名言リストが尽きたら、余った表示枠は非表示にする
                    if (human.array[lang_num] === undefined) {
                        $(add_place).hide();
                        continue;
                    } else {
                        $(add_place).show();
                    }

                    $(add_place + " .name").text(human.array[lang_num].name);
                    $(add_place + " .text").text(human.array[lang_num].lang);
                }
            });
        $('html, body').animate({ scrollTop: 480 });
    });

    //お問い合わせフォームの設定
    $(".contact-page .form-button-wrapper").click(function () {

        //フォームの各値を取得
        let name = $(".contact-page .name").val();
        let address = $(".contact-page .address").val();
        let title = $(".contact-page .title").val();
        let main_text = $(".contact-page .main_text").val();

        //空白ならエラーを返す。値が入ってたら、最終チェック欄に値を入れる。
        if (name === "") {
            $(".form_name .error").text("　※入力されていません");
        } else {
            $(".form_name .error").text("");
            $(".last_check .input_name").text(name + "様");
        }

        if (address === "") {
            $(".form_address .error").text("　※入力されていません");
        } else {
            $(".form_address .error").text("");
            $(".last_check .input_address").text(address);
        }

        if (title === "") {
            $(".form_title .error").text("　※入力されていません");
        } else {
            $(".form_title .error").text("");
            $(".last_check .input_title").text(title);
        }

        if (main_text === "") {
            $(".form_main_text .error").text("　※入力されていません");
        } else {
            $(".form_main_text .error").text("");
            $(".last_check .input_main_text").text(main_text);
        }

        //フォームに記入漏れがなければ、最終チェック欄を表示する
        if (name !== "" && address !== "" && title !== "" && main_text !== "") {
            $(".last_check").show();
            $('html, body').animate({ scrollTop: 0 });
            $("body").css("overflow", "hidden");
            $(".navi-fix").addClass("start");
        }
        return false;
    });

    //最終チェック欄の送信ボタンが押されたら、チェック欄を非表示にして、フォームの値も消去する。
    $(".last_check .send_button").click(function () {
        alert("お問い合わせ内容が送信されました。");
        $(".last_check").hide();
        $("body").css("overflow", "visible");
        $(".navi-fix").removeClass("start");
        $('form').find(':text').val("");
        $('form').find('textarea').val("");

    });

    //最終チェック欄が「×」で閉じられたら、チェック欄は非表示にするがフォームの値は残す。
    $(".last_check .cross").click(function () {
        $(".last_check").hide();
        $("body").css("overflow", "visible");
        $(".navi-fix").removeClass("start");
    });

});