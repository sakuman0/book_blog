$(function () {


    $.ajax({
        url: 'https://book-blog.microcms.io/api/v1/book-list',
        type: 'GET',
        headers: { //microCMS の APIKEY
            'X-API-KEY': 'cb7b6f17-2328-4891-893e-4ad6baa74e22'
        }
    }).then(
        function (data) {
            let len = $(".genre_list").length;  //対象HTML内の[genre_list]の数

            //各ページの記事の金型にデータを挿入
            for (let i = 0; i < len; i++) {
                let target = $(".genre_list").eq(i).attr("class").replace("genre_list", "").trim();
                let target_num = "";
                switch (target) {
                    case "horror":
                        target_num = "7";
                        break;
                    case "suspense":
                        target_num = "6";
                        break;
                    case "mystery":
                        target_num = "5";
                        break;
                    case "history":
                        target_num = "4";
                        break;
                    case "love":
                        target_num = "3";
                        break;
                    case "short":
                        target_num = "0";
                        break;
                    case "long":
                        target_num = "1";
                        break;
                }
                let genre_array = data.contents[target_num];

                const show_book = 3 - 1; //各ページに表示するコンテンツの数　(マイナスは配列対策)

                for (let i = 0; i <= show_book; i++) {

                    let time = new Date(genre_array.book_title[i].time);
                    let format_time = time.getFullYear() + "年" + (time.getMonth() + 1) + "月" +
                        time.getDate() + "日 " + time.getHours() + "時" +
                        time.getMinutes() + "分 更新";

                    let img = $('.' + target + " img").attr("src");
                    let directory = img.substring(0, img.indexOf("images/"));
                    let file = genre_array.book_title[i].image;
                    let url = directory + "images/" + file;

                    $("." + target + " .item-" + i + " .title").text(genre_array.book_title[i].title);
                    $("." + target + " .item-" + i + " .time").text(format_time);
                    $("." + target + " .item-" + i + " .main-text").text(genre_array.book_title[i].text);
                    $("." + target + " .item-" + i + " img").attr("src", url);

                }

            }
        });
});