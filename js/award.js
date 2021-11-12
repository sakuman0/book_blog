$(function () {

    $.ajax({
        url: 'https://book-blog.microcms.io/api/v1/award-list',
        type: 'GET',
        headers: { //microCMS の APIKEY
            'X-API-KEY': 'cb7b6f17-2328-4891-893e-4ad6baa74e22'
        }
    }).then(
        function (data) {
            //各ページの記事の金型にデータを挿入
            let len = $(".award_list").length;  //HTML内の[award_list]の数

            for (let i = 0; i < len; i++) {
                let target = $(".award_list").eq(i).attr("class").replace("award_list", "").trim();
                let target_num = "";

                switch (target) {
                    case "akutagawa":
                        target_num = "2";
                        break;
                    case "naoki":
                        target_num = "1";
                        break;
                    case "honnya":
                        target_num = "0";
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