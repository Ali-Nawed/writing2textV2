export function drawPath(ctx, path) {
    const startCoord = path[0];
    const drawingPath = path.slice(1, path.length);
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#FFFFFF";
    ctx.moveTo(startCoord.x, startCoord.y);
    if (drawingPath.length > 0) {
        drawingPath.forEach(coordinate => {
            ctx.lineTo(coordinate.x, coordinate.y);
        });
    }
    ctx.stroke();
    ctx.save();
    ctx.restore();
}

