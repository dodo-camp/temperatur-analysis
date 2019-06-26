export const browseFile = theme => ({
    root: {
        width: 300,
        height: 200,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
    }
});

export const heading = theme => ({
    title: {
        width: '100%',
        height: '100px',
        fontSize: '2em',
        color: '#031B4D',
        textAlign: 'center'
    },
    wrap: {
        width: '100%',
        padding: '15px 0px 27px'
    },
    content: {
        width: '100%',
        height: '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleUrl: {
        whiteSpace: 'nowrap',
        overflow: 'hidden !important',
        textOverflow: 'ellipsis',
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            width: 300,
        }
    }
});