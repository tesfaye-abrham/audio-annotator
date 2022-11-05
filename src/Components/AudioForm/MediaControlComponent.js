import styles from "./MediaControlComponent.module.css"
const MediaControlComponent = ({ MediaTitle,MediaValue, ListenerOne, ListenerTwo, style={} }) => {
    return <div className={styles['media-control-container']}>
        <div className={styles['media-controls']}>
            <div className={styles['media-button']} id={styles['media-out']} onClick={ListenerOne} >-</div>
            <div id={styles['media-level']}>{MediaValue}</div>
            <div className={styles['media-button']} id={styles['media-in']} onClick={ListenerTwo} >+</div>
        </div>
        {MediaTitle}
    </div>
}

export default MediaControlComponent;