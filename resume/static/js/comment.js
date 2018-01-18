"use strict";
!function () {
    let commentModel = {
        init: function () {
            let APP_ID = '90ce20ES6J438eDeTR0TDhiW-gzGzoHsz';
            let APP_KEY = 'lSJKxFHIGS2iLPVMt8Qx7wGT';
            AV.init({appId: APP_ID, appKey: APP_KEY,});
            this.modelHandler = AV.Object.extend('Comment');
            this.queryHandler = new AV.Query('Comment');
            console.log('Model init success.');
        },
        save: function (data_) {
            if (!this.modelHandler) {
                throw 'Model did not init.'
            }
            let modelObj = new this.modelHandler();
            return modelObj.save(data_);
        },
        query: function () {
            if (!this.queryHandler) {
                throw 'Model did not init.'
            }
            return this.queryHandler.find();
        }
    };
    let commentController = {
            init: function ({view_, model_}) {
                this.model.init();
                let commentForm = view_.querySelector('form');
                let commentListDom = view_.querySelector('.commentList');

                if (!commentForm || !commentListDom) {
                    console.error('Comment init fail1!');
                    return;
                }

                let commentContentDom = view_.querySelector('textarea[name=content]');
                let userNameDom = view_.querySelector('input[name=userName]');
                if (!commentContentDom || !userNameDom) {
                    console.error('Comment init fail2!');
                    return;
                }

                this.commentListDom = commentListDom;
                addEvent(commentView, 'submit', (event_) => {
                    event_.preventDefault();
                    if (!commentContentDom.value || !userNameDom.value) {
                        console.warn('Invalid comment data');
                        return
                    }
                    model_.save(
                        {
                            name: userNameDom.value,
                            content: commentContentDom.value,
                        }
                    ).then(
                        () => {
                            console.log('Comment save success.');
                            commentContentDom.value = '';
                            this.queryComments();
                        }
                    );
                });
                this.queryComments();
                console.log('Comment init success.');
            },
            commentData: [],
            model: commentModel,
            queryComments: function () {
                this.model.query().then((data_) => {
                    this.commentData = data_;
                    this.render();
                }).catch(
                    (err_) => {
                        console.warn(err_);
                    }
                );
            },
            render: function () {
                if (!Array.isArray(this.commentData)) {
                    console.warn('Comment data error.');
                    return;
                }
                this.commentListDom.innerHTML = '';
                this.commentData.forEach((item_) => {
                    let commentData = item_.attributes;
                    let commentContent = document.createElement('li');
                    commentContent.innerText = `${commentData.name}：\t${commentData.content}`;
                    this.commentListDom.appendChild(commentContent);
                })
            }
        }
    ;
    let commentView = document.querySelector('section#comment');
    commentController.init({
        view_: commentView,
        model_: commentModel,
    });
}();