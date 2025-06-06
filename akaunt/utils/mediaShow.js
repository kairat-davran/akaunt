export const imageShow = (src, theme) => {
    return(
        <img src={src} alt="images" className="img-thumbnail"
        style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />
    )
}