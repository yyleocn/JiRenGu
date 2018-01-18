!function () {
    let commentModel = {
        init: function () {
            let APP_ID = '90ce20ES6J438eDeTR0TDhiW-gzGzoHsz';
            let APP_KEY = 'lSJKxFHIGS2iLPVMt8Qx7wGT';
            AV.init({appId: APP_ID, appKey: APP_KEY,});
            let Comment = AV.Object.extend('Comment');
            this.modelHandler = new Comment();
            console.log('Model init success.');
        },
        save: function (data_) {
            if (!this.modelHandler) {
                throw 'Model did not init.'
            }
            return this.modelHandler.save(data_);
        }
    };
    let commentController = {
        init: function (view_, model_) {
            this.model.init();
            let commentContentDom = view_.querySelector('textarea[name=content]');
            let userNameDom = view_.querySelector('input[name=userName]');
            if (!commentContentDom || !userNameDom) {
                console.error('Comment init fail!');
                return;
            }
            addEvent(commentForm, 'submit',
                (event_) => {
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
                        }
                    );
                }
            );
            console.log('Comment init success.');
        },
        model: commentModel,
    };

    let commentForm = document.querySelector('section#comment form');
    commentController.init(
        commentForm,
        commentModel
    );
}();