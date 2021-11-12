$(function () {

    $.ajax({
        url: 'https://book-blog.microcms.io/api/v1/news-list',
        type: 'GET',
        headers: { //microCMS の APIKEY
            'X-API-KEY': 'cb7b6f17-2328-4891-893e-4ad6baa74e22'
        }
    }).then(
        function (data) {

            let genre_array = data.contents[0];

            const show_book = 6 - 1; //各ページに表示するコンテンツの数　(マイナスは配列対策)

            for (let i = 0; i <= show_book; i++) {
                let add_place = ".news .item-" + i;

                let time = new Date(genre_array.news_info[i].time);
                let format_time = time.getFullYear() + "." + ("0" + (time.getMonth() + 1)).slice(-2) + "." +
                    ("0" + time.getDate()).slice(-2);


                $(add_place + " .time").text(format_time);
                $(add_place + " .news-text").text(genre_array.news_info[i].main_text);
                $(add_place + " .distinction").text(genre_array.news_info[i].info);
            }
        });
        console.log($(".news .item-0 .distinction").text());

});