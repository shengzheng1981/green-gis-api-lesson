import {GeometryType} from "../../geometry/geometry";
import {Bound} from "../../util/bound";
import {Projection} from "../../projection/projection";
import {WebMercator} from "../../projection/web-mercator";
import {Raster} from "../../element/raster";

/*
 * 克里金插值
 * http://oeo4b.github.io/#documentation
 * https://rawgit.com/oeo4b/kriging.js/master/kriging.js
 */
export class Kriging extends Raster{
    // Matrix algebra
    private _kriging_matrix_diag (c, n) {
        let i, Z = Array(n*n).fill(0);
        for(i=0;i<n;i++) Z[i*n+i] = c;
        return Z;
    };
    private _kriging_matrix_transpose (X, n, m) {
        let i, j, Z = Array(m*n);
        for(i=0;i<n;i++)
            for(j=0;j<m;j++)
                Z[j*n+i] = X[i*m+j];
        return Z;
    };
    private _kriging_matrix_scale (X, c, n, m) {
        let i, j;
        for(i=0;i<n;i++)
            for(j=0;j<m;j++)
                X[i*m+j] *= c;
    };
    private _kriging_matrix_add (X, Y, n, m) {
        let i, j, Z = Array(n*m);
        for(i=0;i<n;i++)
            for(j=0;j<m;j++)
                Z[i*m+j] = X[i*m+j] + Y[i*m+j];
        return Z;
    };
    // Naive matrix multiplication
    private _kriging_matrix_multiply (X, Y, n, m, p) {
        let i, j, k, Z = Array(n*p);
        for(i=0;i<n;i++) {
            for(j=0;j<p;j++) {
                Z[i*p+j] = 0;
                for(k=0;k<m;k++)
                    Z[i*p+j] += X[i*m+k]*Y[k*p+j];
            }
        }
        return Z;
    };
    // Cholesky decomposition
    private _kriging_matrix_chol (X, n) {
        let i, j, k, sum, p = Array(n);
        for(i=0;i<n;i++) p[i] = X[i*n+i];
        for(i=0;i<n;i++) {
            for(j=0;j<i;j++)
                p[i] -= X[i*n+j]*X[i*n+j];
            if(p[i]<=0) return false;
            p[i] = Math.sqrt(p[i]);
            for(j=i+1;j<n;j++) {
                for(k=0;k<i;k++)
                    X[j*n+i] -= X[j*n+k]*X[i*n+k];
                X[j*n+i] /= p[i];
            }
        }
        for(i=0;i<n;i++) X[i*n+i] = p[i];
        return true;
    };
    // Inversion of cholesky decomposition
    private _kriging_matrix_chol2inv (X, n) {
        let i, j, k, sum;
        for(i=0;i<n;i++) {
            X[i*n+i] = 1/X[i*n+i];
            for(j=i+1;j<n;j++) {
                sum = 0;
                for(k=i;k<j;k++)
                    sum -= X[j*n+k]*X[k*n+i];
                X[j*n+i] = sum/X[j*n+j];
            }
        }
        for(i=0;i<n;i++)
            for(j=i+1;j<n;j++)
                X[i*n+j] = 0;
        for(i=0;i<n;i++) {
            X[i*n+i] *= X[i*n+i];
            for(k=i+1;k<n;k++)
                X[i*n+i] += X[k*n+i]*X[k*n+i];
            for(j=i+1;j<n;j++)
                for(k=j;k<n;k++)
                    X[i*n+j] += X[k*n+i]*X[k*n+j];
        }
        for(i=0;i<n;i++)
            for(j=0;j<i;j++)
                X[i*n+j] = X[j*n+i];

    };
    // Inversion via gauss-jordan elimination
    private _kriging_matrix_solve (X, n) {
        let m = n;
        let b = Array(n*n);
        let indxc = Array(n);
        let indxr = Array(n);
        let ipiv = Array(n);
        let i, icol, irow, j, k, l, ll;
        let big, dum, pivinv, temp;

        for(i=0;i<n;i++)
            for(j=0;j<n;j++) {
                if(i==j) b[i*n+j] = 1;
                else b[i*n+j] = 0;
            }
        for(j=0;j<n;j++) ipiv[j] = 0;
        for(i=0;i<n;i++) {
            big = 0;
            for(j=0;j<n;j++) {
                if(ipiv[j]!=1) {
                    for(k=0;k<n;k++) {
                        if(ipiv[k]==0) {
                            if(Math.abs(X[j*n+k])>=big) {
                                big = Math.abs(X[j*n+k]);
                                irow = j;
                                icol = k;
                            }
                        }
                    }
                }
            }
            ++(ipiv[icol]);

            if(irow!=icol) {
                for(l=0;l<n;l++) {
                    temp = X[irow*n+l];
                    X[irow*n+l] = X[icol*n+l];
                    X[icol*n+l] = temp;
                }
                for(l=0;l<m;l++) {
                    temp = b[irow*n+l];
                    b[irow*n+l] = b[icol*n+l];
                    b[icol*n+l] = temp;
                }
            }
            indxr[i] = irow;
            indxc[i] = icol;

            if(X[icol*n+icol]==0) return false; // Singular

            pivinv = 1 / X[icol*n+icol];
            X[icol*n+icol] = 1;
            for(l=0;l<n;l++) X[icol*n+l] *= pivinv;
            for(l=0;l<m;l++) b[icol*n+l] *= pivinv;

            for(ll=0;ll<n;ll++) {
                if(ll!=icol) {
                    dum = X[ll*n+icol];
                    X[ll*n+icol] = 0;
                    for(l=0;l<n;l++) X[ll*n+l] -= X[icol*n+l]*dum;
                    for(l=0;l<m;l++) b[ll*n+l] -= b[icol*n+l]*dum;
                }
            }
        }
        for(l=(n-1);l>=0;l--)
            if(indxr[l]!=indxc[l]) {
                for(k=0;k<n;k++) {
                    temp = X[k*n+indxr[l]];
                    X[k*n+indxr[l]] = X[k*n+indxc[l]];
                    X[k*n+indxc[l]] = temp;
                }
            }

        return true;
    }

    // Variogram models
    private _kriging_variogram_gaussian (h, nugget, range, sill, A) {
        return nugget + ((sill-nugget)/range)*
            ( 1.0 - Math.exp(-(1.0/A)*Math.pow(h/range, 2)) );
    };
    private _kriging_variogram_exponential (h, nugget, range, sill, A) {
        return nugget + ((sill-nugget)/range)*
            ( 1.0 - Math.exp(-(1.0/A) * (h/range)) );
    };
    private _kriging_variogram_spherical (h, nugget, range, sill, A) {
        if(h>range) return nugget + (sill-nugget)/range;
        return nugget + ((sill-nugget)/range)*
            ( 1.5*(h/range) - 0.5*Math.pow(h/range, 3) );
    };

    // Train using gaussian processes with bayesian priors
    train (t, x, y, model, sigma2, alpha) {
        let variogram = {
            t      : t,
            x      : x,
            y      : y,
            nugget : 0.0,
            range  : 0.0,
            sill   : 0.0,
            A      : 1/3,
            n      : 0,
            model  : null,
            K       : null,
            M       : null
        };
        switch(model) {
            case "gaussian":
                variogram.model = this._kriging_variogram_gaussian;
                break;
            case "exponential":
                variogram.model = this._kriging_variogram_exponential;
                break;
            case "spherical":
                variogram.model = this._kriging_variogram_spherical;
                break;
        };

        // Lag distance/semivariance
        let i, j, k, l, n = t.length;
        let distance = Array((n*n-n)/2);
        for(i=0,k=0;i<n;i++)
            for(j=0;j<i;j++,k++) {
                distance[k] = Array(2);
                distance[k][0] = Math.pow(
                    Math.pow(x[i]-x[j], 2)+
                    Math.pow(y[i]-y[j], 2), 0.5);
                distance[k][1] = Math.abs(t[i]-t[j]);
            }
        distance.sort( (a, b) => { return a[0] - b[0]; });
        variogram.range = distance[(n*n-n)/2-1][0];

        // Bin lag distance
        let lags = ((n*n-n)/2)>30?30:(n*n-n)/2;
        let tolerance = variogram.range/lags;
        let lag = Array(lags).fill(0);
        let semi = Array(lags).fill(0);
        if(lags<30) {
            for(l=0;l<lags;l++) {
                lag[l] = distance[l][0];
                semi[l] = distance[l][1];
            }
        }
        else {
            for(i=0,j=0,k=0,l=0;i<lags&&j<((n*n-n)/2);i++,k=0) {
                while( distance[j][0]<=((i+1)*tolerance) ) {
                    lag[l] += distance[j][0];
                    semi[l] += distance[j][1];
                    j++;k++;
                    if(j>=((n*n-n)/2)) break;
                }
                if(k>0) {
                    lag[l] /= k;
                    semi[l] /= k;
                    l++;
                }
            }
            if(l<2) return variogram; // Error: Not enough points
        }

        // Feature transformation
        n = l;
        variogram.range = lag[n-1]-lag[0];
        let X = Array(2*n).fill(1);
        let Y = Array(n);
        let A = variogram.A;
        for(i=0;i<n;i++) {
            switch(model) {
                case "gaussian":
                    X[i*2+1] = 1.0-Math.exp(-(1.0/A)*Math.pow(lag[i]/variogram.range, 2));
                    break;
                case "exponential":
                    X[i*2+1] = 1.0-Math.exp(-(1.0/A)*lag[i]/variogram.range);
                    break;
                case "spherical":
                    X[i*2+1] = 1.5*(lag[i]/variogram.range)-
                        0.5*Math.pow(lag[i]/variogram.range, 3);
                    break;
            };
            Y[i] = semi[i];
        }

        // Least squares
        let Xt = this._kriging_matrix_transpose(X, n, 2);
        let Z = this._kriging_matrix_multiply(Xt, X, 2, n, 2);
        Z = this._kriging_matrix_add(Z, this._kriging_matrix_diag(1/alpha, 2), 2, 2);
        let cloneZ = Z.slice(0);
        if(this._kriging_matrix_chol(Z, 2))
            this._kriging_matrix_chol2inv(Z, 2);
        else {
            this._kriging_matrix_solve(cloneZ, 2);
            Z = cloneZ;
        }
        let W = this._kriging_matrix_multiply(this._kriging_matrix_multiply(Z, Xt, 2, 2, n), Y, 2, n, 1);

        // Variogram parameters
        variogram.nugget = W[0];
        variogram.sill = W[1]*variogram.range+variogram.nugget;
        variogram.n = x.length;

        // Gram matrix with prior
        n = x.length;
        let K = Array(n*n);
        for(i=0;i<n;i++) {
            for(j=0;j<i;j++) {
                K[i*n+j] = variogram.model(Math.pow(Math.pow(x[i]-x[j], 2)+
                    Math.pow(y[i]-y[j], 2), 0.5),
                    variogram.nugget,
                    variogram.range,
                    variogram.sill,
                    variogram.A);
                K[j*n+i] = K[i*n+j];
            }
            K[i*n+i] = variogram.model(0, variogram.nugget,
                variogram.range,
                variogram.sill,
                variogram.A);
        }

        // Inverse penalized Gram matrix projected to target vector
        let C = this._kriging_matrix_add(K, this._kriging_matrix_diag(sigma2, n), n, n);
        let cloneC = C.slice(0);
        if(this._kriging_matrix_chol(C, n))
            this._kriging_matrix_chol2inv(C, n);
        else {
            this._kriging_matrix_solve(cloneC, n);
            C = cloneC;
        }

        // Copy unprojected inverted matrix as K
        let K2 = C.slice(0);
        let M = this._kriging_matrix_multiply(C, t, n, n, 1);
        variogram.K = K2;
        variogram.M = M;

        return variogram;
    };

    // Model prediction
    predict (x, y, variogram) {
        var i, k = Array(variogram.n);
        for(i=0;i<variogram.n;i++)
            k[i] = variogram.model(Math.pow(Math.pow(x-variogram.x[i], 2)+
                Math.pow(y-variogram.y[i], 2), 0.5),
                variogram.nugget, variogram.range,
                variogram.sill, variogram.A);
        return this._kriging_matrix_multiply(k, variogram.M, 1, variogram.n, 1)[0];
    };
    variance (x, y, variogram) {
        var i, k = Array(variogram.n);
        for(i=0;i<variogram.n;i++)
            k[i] = variogram.model(Math.pow(Math.pow(x-variogram.x[i], 2)+
                Math.pow(y-variogram.y[i], 2), 0.5),
                variogram.nugget, variogram.range,
                variogram.sill, variogram.A);
        return variogram.model(0, variogram.nugget, variogram.range,
            variogram.sill, variogram.A)+
            this._kriging_matrix_multiply(this._kriging_matrix_multiply(k, variogram.K,
                1, variogram.n, variogram.n),
                k, 1, variogram.n, 1)[0];
    };

    // Gridded matrices or contour paths
    grid (polygons, variogram, width) {
        var i, j, k, n = polygons.length;
        if(n==0) return;

        // Boundaries of polygons space
        var xlim = [polygons[0][0][0], polygons[0][0][0]];
        var ylim = [polygons[0][0][1], polygons[0][0][1]];
        for(i=0;i<n;i++) // Polygons
            for(j=0;j<polygons[i].length;j++) { // Vertices
                if(polygons[i][j][0]<xlim[0])
                    xlim[0] = polygons[i][j][0];
                if(polygons[i][j][0]>xlim[1])
                    xlim[1] = polygons[i][j][0];
                if(polygons[i][j][1]<ylim[0])
                    ylim[0] = polygons[i][j][1];
                if(polygons[i][j][1]>ylim[1])
                    ylim[1] = polygons[i][j][1];
            }

        // Alloc for O(n^2) space
        var xtarget, ytarget;
        var a = Array(2), b = Array(2);
        var lxlim = Array(2); // Local dimensions
        var lylim = Array(2); // Local dimensions
        var x = Math.ceil((xlim[1]-xlim[0])/width);
        var y = Math.ceil((ylim[1]-ylim[0])/width);

        var A = Array(x+1);
        const _pip = (array, x, y) => {
            let i, j, c = false;
            for(i=0,j=array.length-1;i<array.length;j=i++) {
                if( ((array[i][1]>y) != (array[j][1]>y)) &&
                    (x<(array[j][0]-array[i][0]) * (y-array[i][1]) / (array[j][1]-array[i][1]) + array[i][0]) ) {
                    c = !c;
                }
            }
            return c;
        };
        for(i=0;i<=x;i++) A[i] = Array(y+1);
        for(i=0;i<n;i++) {
            // Range for polygons[i]
            lxlim[0] = polygons[i][0][0];
            lxlim[1] = lxlim[0];
            lylim[0] = polygons[i][0][1];
            lylim[1] = lylim[0];
            for(j=1;j<polygons[i].length;j++) { // Vertices
                if(polygons[i][j][0]<lxlim[0])
                    lxlim[0] = polygons[i][j][0];
                if(polygons[i][j][0]>lxlim[1])
                    lxlim[1] = polygons[i][j][0];
                if(polygons[i][j][1]<lylim[0])
                    lylim[0] = polygons[i][j][1];
                if(polygons[i][j][1]>lylim[1])
                    lylim[1] = polygons[i][j][1];
            }

            // Loop through polygon subspace
            a[0] = Math.floor(((lxlim[0]-((lxlim[0]-xlim[0])%width)) - xlim[0])/width);
            a[1] = Math.ceil(((lxlim[1]-((lxlim[1]-xlim[1])%width)) - xlim[0])/width);
            b[0] = Math.floor(((lylim[0]-((lylim[0]-ylim[0])%width)) - ylim[0])/width);
            b[1] = Math.ceil(((lylim[1]-((lylim[1]-ylim[1])%width)) - ylim[0])/width);
            for(j=a[0];j<=a[1];j++)
                for(k=b[0];k<=b[1];k++) {
                    xtarget = xlim[0] + j*width;
                    ytarget = ylim[0] + k*width;
                    if(_pip(polygons[i], xtarget, ytarget))
                        A[j][k] = this.predict(xtarget,
                            ytarget,
                            variogram);
                }
        }
        return {
            A: A,
            xlim: xlim,
            ylim: ylim,
            zlim: [Math.min(...variogram.t), Math.max(...variogram.t)],
            width: width
        };
    };
    contour (value, polygons, variogram) {

    };
    plot (grid, xlim, ylim, colors) {
        // Clear screen
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Starting boundaries
        var range = [xlim[1]-xlim[0], ylim[1]-ylim[0], grid.zlim[1]-grid.zlim[0]];
        var i, j, x, y, z;
        var n = grid.A.length;
        var m = grid.A[0].length;
        var wx = Math.ceil(grid.width*this.canvas.width/(xlim[1]-xlim[0]));
        var wy = Math.ceil(grid.width*this.canvas.height/(ylim[1]-ylim[0]));
        for(i=0;i<n;i++){
            for(j=0;j<m;j++) {
                if(grid.A[i][j]==undefined) continue;
                x = this.canvas.width*(i*grid.width+grid.xlim[0]-xlim[0])/range[0];
                y = this.canvas.height*(1-(j*grid.width+grid.ylim[0]-ylim[0])/range[1]);
                z = (grid.A[i][j]-grid.zlim[0])/range[2];
                if(z<0.0) z = 0.0;
                if(z>1.0) z = 1.0;

                ctx.fillStyle = colors[Math.floor((colors.length-1)*z)];
                ctx.fillRect(Math.round(x-wx/2), Math.round(y-wy/2), wx, wy);
            }
        }
    };

    /*
     * 渲染颜色
     */
    public colors: string[] = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"];
    /*
     * 插值算法
     */
    public model: string = "exponential";
    /*
     * 精度 分辨率 1 block = 4 px
     */
    public cellSize: number = 4;
    /**
     * 创建克里金插值
     * @param {number} xmin - 经度左值
     * @param {number} ymin - 纬度下值
     * @param {number} xmax - 经度右值
     * @param {number} ymax - 纬度上值
     * @param {number} width - 栅格宽度
     * @param {number} height - 栅格高度
     * @param {number} cellsize - 栅格大小
     */
    constructor(xmin, ymin, xmax, ymax, width = 1000, height = 1000, cellsize = 4) {
        super(xmin, ymin, xmax, ymax, width, height);
        this.cellSize = cellsize;
    }
    /*
     * 生成插值
     * @param {FeatureClass} featureClass - 插值点要素类
     * @param {Field} field - 插值字段
     */
    generate(featureClass, field) {
        if (featureClass.type != GeometryType.Point) return;
        const values = featureClass.features.map( feature => feature.properties[field.name] );
        const lngs = featureClass.features.map( feature => feature.geometry.lng );
        const lats = featureClass.features.map( feature => feature.geometry.lat );
        const variogram = this.train(values, lngs, lats, this.model, 0, 100);
        const bound = this.bound;
        const boundary = [[[bound.xmin, bound.ymin], [bound.xmin, bound.ymax], [bound.xmax, bound.ymax], [bound.xmax, bound.ymin]]];
        const grid = this.grid(boundary, variogram, (bound.ymax - bound.ymin)/(this.canvas.height/this.cellSize));
        this.plot(grid, [bound.xmin, bound.xmax], [bound.ymin, bound.ymax], this.colors);
    }

    /**
     * 绘制栅格
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {
        let [xmin, ymax] = projection.project([this.bound.xmin, this.bound.ymax]);
        let [xmax, ymin] = projection.project([this.bound.xmax, this.bound.ymin]);
        ctx.save();
        const matrix = (ctx as any).getTransform();
        let screenXMin = (matrix.a * xmin + matrix.e);
        let screenYMin = (matrix.d * ymax + matrix.f);
        let screenXMax = (matrix.a * xmax + matrix.e);
        let screenYMax = (matrix.d * ymin + matrix.f);
        //keep size
        ctx.setTransform(1,0,0,1,0,0);
        //this.resample(this.canvas, this.canvas.width, this.canvas.height, false);
        ctx.drawImage(this.canvas, screenXMin, screenYMin, screenXMax - screenXMin, screenYMax - screenYMin);
        ctx.restore();
    }

}