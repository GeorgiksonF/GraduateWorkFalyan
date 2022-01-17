<template>
    <div class="intro">
        <div class="intro__media">
            <keep-alive>
                <video class="intro__video" src="~@/assets/intro.mp4" autoplay muted loop></video>
            </keep-alive>
        </div>
        <div class="container">
            <div class="intro__info">
                <h1 class="intro__header">Thesis</h1>
                <p class="intro__text">This is the diplom work of a 4th course student of the Institute of Physics of the SSU, 
                    made by Georgiy Falyan. This resource presents a database of scientific papers published by the staff of 
                    the Saratov State University. N. G. Chernyshevsky over the past few years. Information about the article 
                    is taken from the Web Of Science database.</p>
                <b-button to="/publications" variant="primary" class="intro__btn">View publications</b-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .intro {
        height: calc(100vh - 56px);
        position: relative;
        display: flex;
        justify-self: center;

        &__info {
            position: relative;
            text-align: center;
            margin: 200px auto 0;
            z-index: 10;
            color: #fff;
        }

        &__header {
            font-size: 48px;
        }

        &__text {
            margin-top: 30px;
            text-align: center;
            font-size: 20px;
            line-height: 1.8em;
        }

        &__btn {
            margin-top: 30px;
        }

        &__media {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background-size: cover;
            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                z-index: 8;
                background-color: rgba(0, 0, 0, 0.5);
            }
        }
        
        &__video {
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            object-fit: cover;
            transform: translate(-50%, -50%);
        }
    }
</style>