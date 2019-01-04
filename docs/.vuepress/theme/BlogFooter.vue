<template>
    <div class="blog-footer">
        <div class="blog-footer-content">
            <div class="footer-content">
                <div class="logo-wrap">
                    <div class="logo-pic">
                        <div class="background">
                            <span class="title">FE</span>
                        </div>
                    </div>
                    <span class="logo-title">Team</span>
                    <div class="logo-text">独一无二的前端团队</div>
                </div>
                <div class="copy-right">Copyright©2018Team. All Rights Reserved.</div>
            </div>
            <div class="footer-content">
                <div class="links-title">友情链接</div>
                <div class="links-content">
                    <a href="http://fex.baidu.com/" target="_blank" class="link-item">百度FEX</a>
                    <a href="http://taobaofed.org/" target="_blank" class="link-item">淘宝FED</a>
                    <a href="http://cdc.tencent.com/" target="_blank" class="link-item">腾讯 AlloyTeam</a>
                    <a href="http://www.w3ctech.com" target="_blank" class="link-item">w3ctech</a>
                    <a href="http://ued.ctrip.com/blog/?cat=11" target="_blank" class="link-item">携程 UED</a>
                    <a href="http://aotu.io/" target="_blank" class="link-item">凹凸实验室</a>
                </div>
            </div>
            <div class="footer-content">
                <div class="weixin-pic">
                    <img src=""/>
                </div>
                <div class="weixin-title">微信公众号:Team</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "blogFooter"
    }
</script>

<style lang="stylus">
    @import './styles/config.styl'

    .blog-footer {
        width: 100%;
        border-top: 1px solid #d9d8d8;
        background: #f0f0f0;
        margin-top: 1rem;
    }
    .blog-footer-content {
        display: flex;
        justify-content: space-between;
        padding: 1rem 2rem;
        text-align: center;
    }

    .footer-content {
        color: #f6f3ee;
        width: 30%;
        margin: 0;
        font-size: 12px;
    }
    .logo-wrap {
        padding-left: 0;
        padding-top: 2rem;
    }
    .logo-pic {
      display: inline-block;
    }
    .background {
      position: relative;
      display: flex;
      width: 4rem;
      height: 4rem;
      background: #ff6653;
      border-radius: 1rem;
      align-items: center;
      justify-content: center;
    }
    .title {
      font-size: 1.8rem;
      font-weight: 900;
      color: #fff;
    }
    .logo-title {
        display: inline-block;
        font-size: 30px;
        font-family: PingFangSC-Semibold;
        color: #000;
        margin-left: 1rem;
    }
    .logo-text {
        font-size: 16px;
        margin-top: .5rem;
        color: #000;
    }
    .copy-right {
        text-align: center;
        margin-top: 1rem;
        color: #000;
    }
    .links-title {
        font-size: 18px;
        padding: 1rem 0;
        color: #000;
    }
    .link-item {
        display: block;
        font-size: 12px;
        color: #4a4a4a;
        line-height: 1.4rem;
    }
    .weixin-pic {
        width: 10rem;
        height: 10rem;
        margin: auto;
    }
    img {
        width: 100%;
        height: 100%;
    }
    .weixin-title {
        margin-top: 1rem;
        color: gray;
    }
@media (max-width: ($MQMobile + 1px))
    .blog-footer-content
        .footer-content
            width 100%
            padding-bottom 1rem
            background #fff

</style>