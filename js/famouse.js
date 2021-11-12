$(function () {

    $.ajax({
        url: 'https://book-blog.microcms.io/api/v1/famouse',
        type: 'GET',
        headers: { //microCMS の APIKEY
            'X-API-KEY': 'cb7b6f17-2328-4891-893e-4ad6baa74e22'
        }
    }).then(
        //////  名言ページ or 名言セクションの初期状態のデータを挿入する設定  //////
        function (data) {
            let human = data.contents[0];
            const show_lang = $(".gift-list .list-item").length - 1; //ページ内に表示する名言の数

            for (let i = 0; i <= show_lang; i++) {

                let add_place = ".gift-list .item-" + i;

                //名言リストが尽きたら、余った表示枠は非表示にする
                if (human.array[i] === undefined) {
                    $(add_place).hide();
                    continue;
                } else {
                    $(add_place).show();
                }

                $(add_place + " .name").text(human.array[i].name);
                $(add_place + " .text").text(human.array[i].lang);
            }
        });
    $('html, body').animate({ scrollTop: 480 });
});

