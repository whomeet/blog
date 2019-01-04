<template>
    <div class="bear-button-container">
        <p>{{title}}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '博客'
        }
    },
}
</script>


<style>
.bear-button-container {
    height: 49px;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    font-size: 16px;
    border-radius: 4px;
    background: rgb(52, 162, 105);
    box-shadow: 0 0 14px 0 #C7D5FF;
}
/* .bear-button-container:hover {
    background: lighten($color: rgb(52, 162, 105), $amount: 20);
}
.bear-button-container:active {
    background: darken($color: rgb(52, 162, 105), $amount: 20);
} */
</style>

