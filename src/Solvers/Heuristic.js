const manhattanDistance = (node) => {
    let result = 0;
    for (let i = 0; i < node.state.length; i++) {
        for (let j = 0; j < node.state[i].length; j++) {
            let elem = node.state[i][j];
            if (elem == 0)
                continue;
            let targetRow = parseInt((elem-1) / node.state.length);
            let targetCol = (elem - 1) % node.state.length;
            // console.log(elem + " " + targetRow + " " + targetCol + " " + Math.abs(i - targetRow) + Math.abs(j - targetCol));

            result += Math.abs(i - targetRow) + Math.abs(j - targetCol);
        }
    }
    // console.table(node.state);
    // console.log(result);

    return result;
};
export default manhattanDistance;