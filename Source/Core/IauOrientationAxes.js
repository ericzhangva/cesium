/*global define*/
define([
        './Cartesian3',
        './defined',
        './Iau2000Orientation',
        './JulianDate',
        './Math',
        './Matrix3',
        './Quaternion'
    ], function(
        Cartesian3,
        defined,
        Iau2000Orientation,
        JulianDate,
        CesiumMath,
        Matrix3,
        Quaternion) {
    "use strict";

    /**
     * The Axes representing the orientation of a Central Body as represented by the data
     * from the IAU/IAG Working Group reports on rotational elements.
     * @alias IauOrientationAxes
     * @constructor
     *
     * @param {Function} [computeFunction] The function that computes the {@link IauOrientationParameters} given a {@link JulianDate}.
     *
     * @exception {DeveloperError} computeFunction is required.
     *
     * @see Iau2000Orientation
     */
    var IauOrientationAxes = function (computeFunction) {
        if (!defined(computeFunction) || typeof computeFunction !== 'function') {
            computeFunction = Iau2000Orientation.ComputeMoon;
        }

        this._computeFunction = computeFunction;
    };

    var xAxisScratch = new Cartesian3();
    var yAxisScratch = new Cartesian3();
    var zAxisScratch = new Cartesian3();

    function computeRotationMatrix(alpha, delta, result) {
        var xAxis = xAxisScratch;
        xAxis.x = Math.cos(alpha + CesiumMath.PI_OVER_TWO);
        xAxis.y = Math.sin(alpha + CesiumMath.PI_OVER_TWO);
        xAxis.z = 0.0;

        var cosDec = Math.cos(delta);

        var zAxis = zAxisScratch;
        zAxis.x = cosDec * Math.cos(alpha);
        zAxis.y = cosDec * Math.sin(alpha);
        zAxis.z = Math.sin(delta);

        var yAxis = Cartesian3.cross(zAxis, xAxis, yAxisScratch);

        if (!defined(result)) {
            result = new Matrix3();
        }

        result[0] = xAxis.x;
        result[1] = yAxis.x;
        result[2] = zAxis.x;
        result[3] = xAxis.y;
        result[4] = yAxis.y;
        result[5] = zAxis.y;
        result[6] = xAxis.z;
        result[7] = yAxis.z;
        result[8] = zAxis.z;

        return result;
    }

    var rotMtxScratch = new Matrix3();
    var quatScratch = new Quaternion();

    /**
     * Computes a rotation from ICRF to a Central Body's Fixed axes.
     * @memberof IauOrientationAxes
     *
     * @param {JulianDate} date The date to evaluate the matrix.
     * @param {Matrix3} result The object onto which to store the result.
     *
     * @returns {Matrix} The modified result parameter or a new instance of the rotation from ICRF to Fixed.
     */
    IauOrientationAxes.prototype.evaluate = function(date, result) {
        if (!defined(date)) {
            date = new JulianDate();
        }

        var alphaDeltaW = this._computeFunction(date);
        var precMtx = computeRotationMatrix(alphaDeltaW.rightAscension, alphaDeltaW.declination, result);

        var rot = CesiumMath.zeroToTwoPi(alphaDeltaW.rotation);
        var quat = Quaternion.fromAxisAngle(Cartesian3.UNIT_Z, rot, quatScratch);
        var rotMtx = Matrix3.fromQuaternion(Quaternion.conjugate(quat, quat), rotMtxScratch);

        var cbi2cbf = Matrix3.multiply(rotMtx, precMtx, precMtx);
        return cbi2cbf;
    };

    return IauOrientationAxes;
});