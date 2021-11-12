$(function () {

    $.ajax({
        url: 'https://book-blog.microcms.io/api/v1/news-list',
        type: 'GET',
        headers: { //microCMS の APIKEY
            'X-API-KEY': 'cb7b6f17-2328-4891-893e-4ad6baa74e22'
        }
    }).then(
        function (data) {

            //DBの要素数に応じて、ページ遷移ボタンの数を変更する
            let genre_array = data.contents[0];

            let selector_num = genre_array.news_info.length % 12;

            for (let i = 2; i <= selector_num; i++) {
                let append_item = "<li class=''>" + i + "</li>";
                $(".page-selector ul").append(append_item);

                if (i === selector_num) {
                    $(".page-selector ul").append("<li class='next'>＞</li>");
                }
            }

            const show_book = 12 - 1; //各ページに表示するコンテンツの数　(マイナスは配列対策)

            for (let i = 0; i <= show_book; i++) {
                let add_place = ".news-page .item-" + i;

                let time = new Date(genre_array.news_info[i].time);
                let format_time = time.getFullYear() + "年" + (time.getMonth() + 1) + "月" +
                    time.getDate() + "日 " + time.getHours() + "時" +
                    time.getMinutes() + "分 更新";

                let img = $(".news-page .item-" + i + " img").attr("src");
                let directory = img.substring(0, img.indexOf("images/"));
                let file = genre_array.news_info[i].image;
                let url = directory + "images/" + file;

                $(add_place + " .title").text(genre_array.news_info[i].title);
                $(add_place + " .time").text(format_time);
                $(add_place + " .news-text").text(genre_array.news_info[i].main_text);
                $(add_place + " img").attr("src", url);
                $(add_place + " .distinction").text(genre_array.news_info[i].info);
            }

        }).then(function (data) {
            //ページ遷移ボタンの動きを設定する
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

                //矢印がクリックされた時、次の要素が矢印の場合以外は、前or後の要素を選択状態にする。
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

                $('html, body').animate({ scrollTop: 480 });

                //ジャンル別小説ページ遷移設定
                $.ajax({
                    url: 'https://book-blog.microcms.io/api/v1/news-list',
                    type: 'GET',
                    headers: { //microCMS の APIKEY
                        'X-API-KEY': 'cb7b6f17-2328-4891-893e-4ad6baa74e22'
                    }
                }).then(
                    //記事の表示設定
                    function (data) {
                        let genre_array = data.contents[0];

                        const show_book = 12 - 1; //各ページに表示するコンテンツの数　(マイナスは配列対策)

                        let click_num = $(".page-selector .selected").index(); //押された遷移番号

                        //DBを show_book の設定数ごとに分割したい。
                        let min = (click_num - 1) * show_book;
                        let max = click_num * show_book;

                        //配列は0スタートだから、最初のページだけは、0スタートで設定する必要がある。
                        if (click_num > 1) { min++; max++; }

                        for (let i = min; i <= max; i++) {
                            let current_page_num = i % (show_book + 1); // 8番目以降も 0 ～ 7 でループさせる
                            let add_place = ".news-page .item-" + current_page_num;


                            if (genre_array.news_info[i] === undefined) {
                                $(add_place).hide();
                                continue;
                            } else {
                                $(add_place).show();
                            }

                            let time = new Date(genre_array.news_info[i].time);
                            let format_time = time.getFullYear() + "年" + (time.getMonth() + 1) + "月" +
                                time.getDate() + "日 " + time.getHours() + "時" +
                                time.getMinutes() + "分 更新";


                            $(add_place + " .title").text(genre_array.news_info[i].title);
                            $(add_place + " .time").text(format_time);
                            $(add_place + " .news-text").text(genre_array.news_info[i].main_text);
                            $(add_place + " .distinction").text(genre_array.news_info[i].info);

                        }
                    });
            });
        });
});