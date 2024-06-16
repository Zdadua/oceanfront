export function init() {
    let cubes = [];
    for(let i = 0; i < 21; i++) {
        cubes.push([]);
        for(let j = 0; j < 56; j++) {
            cubes[i][j] = 1;
        }
    }

    // 初始化O
    for(let i = 9; i < 12; i++) {
        cubes[i][5] = 0;
        cubes[i][13] = 0;
    }

    for(let i = 8; i < 13; i++) {
        cubes[i][6] = 0;
        cubes[i][12] = 0;
    }

    cubes[7][7] = 0;
    cubes[13][7] = 0;
    cubes[6][8] = 0;
    cubes[14][8] = 0;
    cubes[6][9] = 0;
    cubes[14][9] = 0;
    cubes[6][10] = 0;
    cubes[14][10] = 0;
    cubes[7][11] = 0;
    cubes[13][11] = 0;

    // 初始化c
    cubes[11][15] = 0;
    cubes[12][15] = 0;
    for(let i = 10; i < 14; i++) {
        cubes[i][16] = 0;
    }
    cubes[9][17] = 0;
    cubes[14][17] = 0;
    cubes[9][18] = 0;
    cubes[14][18] = 0;
    cubes[9][19] = 0;
    cubes[10][19] = 0;
    cubes[13][19] = 0;
    cubes[14][19] = 0;
    cubes[10][20] = 0;
    cubes[13][20] = 0;

    // 初始化E
    for(let i = 6; i < 15; i++) {
        cubes[i][22] = 0;
    }
    cubes[6][23] = 0;
    cubes[6][24] = 0;
    cubes[6][25] = 0;
    cubes[6][26] = 0;
    cubes[6][27] = 0;
    cubes[7][26] = 0;
    cubes[14][23] = 0;
    cubes[14][24] = 0;
    cubes[14][25] = 0;
    cubes[14][26] = 0;
    cubes[13][27] = 0;
    cubes[14][27] = 0;
    cubes[10][23] = 0;
    cubes[10][24] = 0;
    cubes[10][25] = 0;
    cubes[10][26] = 0;

    // 初始化a
    cubes[9][29] = 0;
    cubes[12][29] = 0;
    cubes[13][29] = 0;
    cubes[8][30] = 0;
    cubes[8][31] = 0;
    cubes[11][30] = 0;
    cubes[11][31] = 0;
    cubes[14][30] = 0;
    cubes[14][31] = 0;
    for(let i = 9; i < 14; i++) {
        cubes[i][32] = 0;
    }
    cubes[14][33] = 0;

    // 初始化r
    cubes[9][34] = 0;
    for(let i = 9; i < 15; i++) {
        cubes[i][35] = 0;
    }
    cubes[10][36] = 0;
    cubes[9][37] = 0;
    cubes[9][38] = 0;

    // 初始化t
    cubes[9][40] = 0;
    cubes[9][41] = 0;
    for(let i = 7; i < 15; i++) {
        cubes[i][42] = 0;
    }
    cubes[9][43] = 0;
    cubes[9][44] = 0;
    cubes[14][43] = 0;
    cubes[13][44] = 0;

    // 初始化h
    for(let i = 6; i < 15; i++) {
        cubes[i][46] = 0;
    }
    cubes[10][47] = 0;
    cubes[9][48] = 0;
    cubes[9][49] = 0;
    for(let i = 10; i < 15; i++) {
        cubes[i][50] = 0;
    }

    // 初始化缺损
    for(let i = 0; i < 4; i++) {
        for(let j = 3 - i; j >= 0; j--) {
            cubes[i][j] = -1;
        }
    }
    cubes[19][55] = -1;
    cubes[18][55] = -1;
    cubes[17][55] = -1;
    cubes[18][54] = -1;
    cubes[19][53] = -1;
    cubes[20][52] = -1;

    // 初始化深蓝
    cubes[4][0] = 2;
    cubes[5][0] = 2;
    cubes[6][0] = 4;
    cubes[5][1] = 4;
    cubes[3][2] = 4;
    cubes[2][3] = 4;
    cubes[1][4] = 4;
    cubes[0][5] = 4;
    cubes[4][1] = 4;
    cubes[0][4] = 4;
    cubes[3][1] = 2;
    cubes[2][2] = 2;
    cubes[1][3] = 2;

    // 初始化深绿
    cubes[8][12] = 6;
    cubes[9][12] = 3;
    cubes[9][13] = 6;
    cubes[10][12] = 3;
    cubes[10][13] = 6;
    cubes[11][12] = 6;
    cubes[11][13] = 6;

    return cubes;
}