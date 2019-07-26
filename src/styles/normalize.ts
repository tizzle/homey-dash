import { dimensions, fonts, colors, mediaqueries } from './variables'

export default `
  @font-face {
    font-family: "Rubik-Mono";
    src: url('/fonts/RubikMonoOne-Regular.ttf');
  }

  @font-face {
    font-family: "Rubik";
    font-weight: 300;
    src: url('/fonts/Rubik-Light.ttf');
  }

  @font-face {
    font-family: "Rubik";
    font-weight: 400;
    src: url('/fonts/Rubik-Regular.ttf');
  }

  @font-face {
    font-family: "Rubik";
    font-weight: 500;
    src: url('/fonts/Rubik-Medium.ttf');
  }

  @font-face {
    font-family: "Rubik";
    font-weight: 700;
    src: url('/fonts/Rubik-Bold.ttf');
  }

  @font-face {
    font-family: "Rubik";
    font-weight: 900;
    src: url('/fonts/Rubik-Black.ttf');
  }

  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  html {
    font-size: ${dimensions.fontSize.regular}px !important;
    line-height: ${dimensions.lineHeight.regular} !important;
  }

  body {
    margin: 0;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    font-family: ${fonts.sansSerif};
    color: ${colors.black};
    background-color: ${colors.white};
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  a {
    text-decoration: underline;
    color: inherit;
  }

  img {
    max-width: 100%;
    object-fit: contain;
    position: relative;
  }

  figure {
    margin: 2rem 0;
  }

  figcaption {
    font-size: 80%;
  }

  table {
    width: 100%;
    margin-bottom: 1rem;
    border: 1px solid ${colors.ui.light};
    font-size: 85%;
    border-collapse: collapse;
  }

  td,
  th {
    padding: .25rem .5rem;
    border: 1px solid ${colors.ui.light};
  }

  th {
    text-align: left;
  }

  tbody {
    tr {
      &:nth-of-type(odd) {
        td {
          background-color: ${colors.ui.whisper};
        }
        tr {
          background-color: ${colors.ui.whisper};
        }
      }
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.414rem;
    margin-bottom: .5rem;
    color: ${colors.black};
    font-family: ${fonts.headline};
    font-weight: 400;
    line-height: ${dimensions.lineHeight.heading};
    text-align: left;
    text-rendering: geometricPrecision;
  }

  h1 {
    margin-top: 0;
    font-size: ${dimensions.headingSizesMobile.h1}rem;
    ${mediaqueries.md} {
      font-size: ${dimensions.headingSizesTablet.h1}rem;
    }
  }

  h2 {
    font-size: ${dimensions.headingSizesMobile.h2}rem;
    ${mediaqueries.md} {
      font-size: ${dimensions.headingSizesTablet.h2}rem;
    }
  }

  h3 {
    font-size: ${dimensions.headingSizesMobile.h3}rem;
    ${mediaqueries.md} {
      font-size: ${dimensions.headingSizesTablet.h3}rem;
    }
  }

  h4 {
    font-size: ${dimensions.headingSizesMobile.h4}rem;
    ${mediaqueries.md} {
      font-size: ${dimensions.headingSizesTablet.h4}rem;
    }
  }

  h5, h6 {
    font-size: ${dimensions.headingSizesMobile.h5}rem;
    ${mediaqueries.md} {
      font-size: ${dimensions.headingSizesTablet.h5}rem;
    }
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  strong {
    color: ${colors.black};
  }

  ul,
  ol,
  dl {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  dt {
    font-weight: bold;
  }

  dd {
    margin-bottom: .5rem;
  }

  hr {
    position: relative;
    margin: 2rem 0;
    border: 0;
    border-top: 1px solid ${colors.ui.bright};
  }

  blockquote {
    margin: .8rem 0;
    padding: .5rem 1rem;
    border-left: .25rem solid ${colors.ui.light};
    color: ${colors.gray.calm};

    p {
      &:last-child {
        margin-bottom: 0;
      }
    }

    ${mediaqueries.md} {
      padding-right: 5rem;
      padding-left: 1.25rem;
    }
  }

  .ReactModal__Overlay ReactModal__Overlay--after-open {
    z-index: 9999 !important;
  }
`
