// inBox.js
// ========

module.exports = {

    getNeighbourhood: function (x, y, neighbourhood) {
        'use strict';

        function Point(x, y) {
            if (Object.prototype.toString.call(x) === '[object Array]') {
                this.x = x[1];
                this.y = x[0];
            } else {
                this.x = x;
                this.y = y;
            }
        }

        function Line(point1, point2) {
            this.point1 = point1;
            this.point2 = point2;
        }
     
        function findMaxY() {
            var maxY;
            neighbourhood.geometry[0].coordinates[0].forEach(function (coordinate) {
                var p = new Point(coordinate);
                if (typeof maxY === 'undefined' || p.y > maxY) {
                    maxY = p.Y;
                }
            });

            return maxY || 0;
        }

           
        var point = new Point(x, y),
            neighbourhoodRet,
            maxY = findMaxY();

        function lineFromPoint(point) {
            return new Line(point, new Point(point.x, maxY));
        }

        function lineCrossesLine(lineA, lineB) {
            var a1 = lineA.point1,
                a2 = lineA.point2,
                b1 = lineB.point1,
                b2 = lineB.point2,
                aCrossProduct = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
                bCrossProduct = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
                normalFactor  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y),
                aNormalized,
                bNormalized;

            if (normalFactor) {
                aNormalized = aCrossProduct / normalFactor;
                bNormalized = bCrossProduct / normalFactor;

                return aNormalized > 0 && aNormalized <= 1 && bNormalized > 0 && bNormalized <= 1;
            }
            
            //lines are coincident   ie lineA is a ontop lineB or vice versa 
            return !aCrossProduct || !bCrossProduct;
        }

        function projectionCrossesLine(point, line) {
            var projection = lineFromPoint(point);
            return lineCrossesLine(line, projection);
        }

        var previous = null,
            edges = [],
            count = 0;

        neighbourhood.geometry[0].coordinates[0].forEach(function (coordinate) {
            if (previous) {
                edges.push(new Line(new Point(previous), new Point(coordinate)));
            }
            previous = coordinate;
        });

        edges.forEach(function (edge) {
            if (projectionCrossesLine(point, edge)) {
                count = count + 1;
            }
        });

        console.log(neighbourhood.properties[0].HOOD + ": " + count);

        if (count % 2) {
            neighbourhoodRet = neighbourhood.properties[0].HOOD;
            //return console.log('Your point is in ' + neighbourhoodRet);
            return true;
        }

        if (!neighbourhoodRet) {
            //console.log("Neibourhood could not be detected");
            return false;
        }
        
        return neighbourhoodRet;
    }
};

/*

var trinity_bellwoods = [{ "type": "Feature", "properties": { "DAUID": "35200879", "PRUID": "35", "CSDUID": "3520005", "HOODNUM": 81, "HOOD": "Trinity-Bellwoods", "FULLHOOD": "Trinity-Bellwoods (81)" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.404282800449266, 43.647979616068149 ], [ -79.403956753621998, 43.647182710744943 ], [ -79.422367865782221, 43.643467621011894 ], [ -79.426405439465128, 43.653607643265183 ], [ -79.418687921131777, 43.655217309937044 ], [ -79.417698785211911, 43.65524323486715 ], [ -79.415147366859514, 43.654963225171983 ], [ -79.40767889826175, 43.656464424471459 ], [ -79.404282800449266, 43.647979616068149 ] ] ] } }];
var annex = [{ "type": "Feature", "properties": { "DAUID": "35200988", "PRUID": "35", "CSDUID": "3520005", "HOODNUM": 95, "HOOD": "Annex", "FULLHOOD": "Annex (95)" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.387179698213544, 43.671293647166195 ], [ -79.386736720430861, 43.670233989925087 ], [ -79.418406235349835, 43.663554548931799 ], [ -79.421842604613488, 43.672479760726951 ], [ -79.401373252282198, 43.67678738142164 ], [ -79.399044441585815, 43.677592157327702 ], [ -79.391191257135162, 43.681127889818491 ], [ -79.387179698213544, 43.671293647166195 ] ] ] } }];
     
//getNeighbourhood(43.649214, -79.417779, trinity_bellwoods);
//getNeighbourhood(43.6702, -79.387636, trinity_bellwoods);
//getNeighbourhood(43.649214,-79.417779, annex);
getNeighbourhood(43.668229,-79.42008, annex);
getNeighbourhood(43.668803,-79.390554, annex);

*/