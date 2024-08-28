import React, { useEffect } from 'react'

function useDraw() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    useEffect(()=>{},[])
    return {
        canvasRef
    }
}

export default useDraw