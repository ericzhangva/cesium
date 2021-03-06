/*global define*/
define([
        './DeveloperError',
        './defaultValue',
        './defined'
    ], function(
        DeveloperError,
        defaultValue,
        defined) {
    "use strict";

    /**
     * A set of curvilinear 3-dimensional coordinates.
     *
     * @alias Spherical
     * @constructor
     *
     * @param {Number} [clock=0.0] The angular coordinate lying in the xy-plane measured from the positive x-axis and toward the positive y-axis.
     * @param {Number} [cone=0.0] The angular coordinate measured from the positive z-axis and toward the negative z-axis.
     * @param {Number} [magnitude=1.0] The linear coordinate measured from the origin.
     */
    var Spherical = function(clock, cone, magnitude) {
        this.clock = defaultValue(clock, 0.0);
        this.cone = defaultValue(cone, 0.0);
        this.magnitude = defaultValue(magnitude, 1.0);
    };

    /**
     * Converts the provided Cartesian3 into Spherical coordinates.
     * @memberof Spherical
     *
     * @param {Cartesian3} cartesian3 The Cartesian3 to be converted to Spherical.
     * @param {Spherical} [spherical] The object in which the result will be stored, if undefined a new instance will be created.
     *
     * @returns The modified result parameter, or a new instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian3 is required.
     */
    Spherical.fromCartesian3 = function(cartesian3, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(cartesian3)) {
            throw new DeveloperError('cartesian3 is required');
        }
        //>>includeEnd('debug');

        var x = cartesian3.x;
        var y = cartesian3.y;
        var z = cartesian3.z;
        var radialSquared = x * x + y * y;

        if (!defined(result)) {
            result = new Spherical();
        }

        result.clock = Math.atan2(y, x);
        result.cone = Math.atan2(Math.sqrt(radialSquared), z);
        result.magnitude = Math.sqrt(radialSquared + z * z);
        return result;
    };

    /**
     * Creates a duplicate of a Spherical.
     * @memberof Spherical
     *
     * @param {Spherical} spherical The spherical to clone.
     * @param {Spherical} [result] The object to store the result into, if undefined a new instance will be created.
     *
     * @returns The modified result parameter or a new instance if result was undefined. (Returns undefined if spherical is undefined)
     */
    Spherical.clone = function(spherical, result) {
        if (!defined(spherical)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Spherical(spherical.clock, spherical.cone, spherical.magnitude);
        }

        result.clock = spherical.clock;
        result.cone = spherical.cone;
        result.magnitude = spherical.magnitude;
        return result;
    };

    /**
     * Computes the normalized version of the provided spherical.
     * @memberof Spherical
     *
     * @param {Spherical} spherical The spherical to be normalized.
     * @param {Spherical} [result] The object to store the result into, if undefined a new instance will be created.
     *
     * @returns The modified result parameter or a new instance if result was undefined.
     *
     * @exception {DeveloperError} spherical is required.
     */
    Spherical.normalize = function(spherical, result) {
      //>>includeStart('debug', pragmas.debug);
        if (!defined(spherical)) {
            throw new DeveloperError('spherical is required');
        }
        //>>includeEnd('debug');

        if (!defined(result)) {
            return new Spherical(spherical.clock, spherical.cone, 1.0);
        }

        result.clock = spherical.clock;
        result.cone = spherical.cone;
        result.magnitude = 1.0;
        return result;
    };

    /**
     * Returns true if the first spherical is equal to the second spherical, false otherwise.
     * @memberof Spherical
     *
     * @param {Spherical} left The first Spherical to be compared.
     * @param {Spherical} right The second Spherical to be compared.
     *
     * @returns true if the first spherical is equal to the second spherical, false otherwise.
     */
    Spherical.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.clock === right.clock) &&
                (left.cone === right.cone) &&
                (left.magnitude === right.magnitude));
    };

    /**
     * Returns true if the first spherical is within the provided epsilon of the second spherical, false otherwise.
     * @memberof Spherical
     *
     * @param {Spherical} left The first Spherical to be compared.
     * @param {Spherical} right The second Spherical to be compared.
     * @param {Number} [epsilon=0.0] The epsilon to compare against.
     *
     * @returns true if the first spherical is within the provided epsilon of the second spherical, false otherwise.
     */
    Spherical.equalsEpsilon = function(left, right, epsilon) {
        epsilon = defaultValue(epsilon, 0.0);
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (Math.abs(left.clock - right.clock) <= epsilon) &&
                (Math.abs(left.cone - right.cone) <= epsilon) &&
                (Math.abs(left.magnitude - right.magnitude) <= epsilon));
    };

    /**
     * Returns a string representing the provided instance in the format (clock, cone, magnitude).
     * @memberof Spherical
     *
     * @param {Spherical} spherical The object to be converted.
     *
     * @returns A string representing the provided instance.
     */
    Spherical.toString = function(spherical) {
        return '(' + spherical.clock + ', ' + spherical.cone + ', ' + spherical.magnitude + ')';
    };

    /**
     * Creates a duplicate of this Spherical.
     * @memberof Spherical
     *
     * @param {Spherical} [result] The object to store the result into, if undefined a new instance will be created.
     *
     * @returns The modified result parameter or a new instance if result was undefined.
     */
    Spherical.prototype.clone = function(result) {
        return Spherical.clone(this, result);
    };

    /**
     * Computes the normalized version of this spherical.
     * @memberof Spherical
     *
     * @param {Spherical} [result] The object to store the result into, if undefined a new instance will be created.
     *
     * @returns The modified result parameter or a new instance if result was undefined.
     */
    Spherical.prototype.normalize = function(result) {
        return Spherical.normalize(this, result);
    };

    /**
     * Returns true if this spherical is equal to the provided spherical, false otherwise.
     * @memberof Spherical
     *
     * @param {Spherical} other The Spherical to be compared.
     *
     * @returns true if this spherical is equal to the provided spherical, false otherwise.
     */
    Spherical.prototype.equals = function(other) {
        return Spherical.equals(this, other);
    };

    /**
     * Returns true if this spherical is within the provided epsilon of the provided spherical, false otherwise.
     * @memberof Spherical
     *
     * @param {Spherical} other The Spherical to be compared.
     * @param {Number} epsilon The epsilon to compare against.
     *
     * @returns true if this spherical is within the provided epsilon of the provided spherical, false otherwise.
     */
    Spherical.prototype.equalsEpsilon = function(other, epsilon) {
        return Spherical.equalsEpsilon(this, other, epsilon);
    };

    /**
     * Returns a string representing this instance in the format (clock, cone, magnitude).
     * @memberof Spherical
     *
     * @returns A string representing this instance.
     */
    Spherical.prototype.toString = function() {
        return Spherical.toString(this);
    };

    return Spherical;
});
