// inBox.js
// ========

module.exports = {

    getNeighbourhood: function (longitude, latitude, neighbourhoods, noLogging) {
        'use strict';

        function Point(longitude, latitude) {
            if (Object.prototype.toString.call(longitude) === '[object Array]') {
                this.longitude = longitude[0];
                this.latitude = longitude[1];
            } else {
                this.longitude = longitude;
                this.latitude = latitude;
            }
        }

        function Line(pointA, pointB) {
            this.pointA = pointA;
            this.pointB = pointB;
        }
     
        function findMaxLong() {
            var longPoint = new Point(neighbourhoods[0].geometry[0].coordinates[0][1]).longitude ;
            /*var maxLong;
            
            neighbourhoods.forEach(function (neighbourhood) {
                neighbourhood.geometry.coordinates[0].forEach(function (coordinate) {
                    var p = new Point(coordinate);
                    if (typeof maxLong === 'undefined' || p.longitude > maxLong) {
                        maxLong = p.longitude;
                    }
                });
            });
            log('Highest longtitude in all neighbourhoods is ' + maxLong);

            return maxLong || 0;*/
        }
        
        function lineCrossesLine(line1, line2) {
            var a1 = line1.pointA,
                a2 = line1.pointB,
                b1 = line2.pointA,
                b2 = line2.pointB,
                aCrossProduct = (b2.longitude - b1.longitude) * (a1.latitude - b1.latitude) - (b2.latitude - b1.latitude) * (a1.longitude - b1.longitude),
                bCrossProduct = (a2.longitude - a1.longitude) * (a1.latitude - b1.latitude) - (a2.latitude - a1.latitude) * (a1.longitude - b1.longitude),
                normalFactor  = (b2.latitude - b1.latitude) * (a2.longitude - a1.longitude) - (b2.longitude - b1.longitude) * (a2.latitude - a1.latitude),
                aNormalized,
                bNormalized;

            if (normalFactor) {
                aNormalized = aCrossProduct / normalFactor;
                bNormalized = bCrossProduct / normalFactor;

                return aNormalized > 0 && aNormalized <= 1 && bNormalized > 0 && bNormalized <= 1;
            }
            
            //lines are coincident  ie lineA is a ontop lineB or vice versa 
            return !aCrossProduct || !bCrossProduct;
        }

        function log(msg, important) {
            if (!noLogging || important) {
                console.log(msg);
            }
        }

        var point = new Point(longitude, latitude),
            maxLong = -78.882437, // A point in Oshawa
            neighbourhood,
            hood,
            hoods = [],
            count,
            coordinates,
            coordinate,
            isOdd,
            len,
            previous;

        function rayFromPoint(point) {
            return new Line(point, new Point(maxLong, point.latitude));
        }
        
        function rayCrossesLine(point, line) {
            return lineCrossesLine(rayFromPoint(point), line);
        }

        //logic starts here
        for (hood in neighbourhoods) {
            if (neighbourhoods.hasOwnProperty(hood)) {
                neighbourhood = neighbourhoods[hood];
                coordinates = neighbourhood.geometry[0].coordinates[0];

                //find all the edges in each neighbourhood
                len = coordinates.length;
                count = 0;
                while (len--) {
                    //for each edge in the neighbourhood, draw a ray from the point in an arbitrariy direction, and see if we cross that edge
                    coordinate = coordinates[len];
                    if (previous && rayCrossesLine(point, new Line(new Point(previous), new Point(coordinate)))) {
                        count++;
                    }
                    previous = coordinate;
                }

                //we've found the neighbourhood if we've crossed an odd number of edges in any of the neighbourhoods
                //see: http://www.yaldex.com/game-programming/0131020099_ch22lev1sec1.html#ch22fig04
                isOdd = count % 2;
                log('Your point had ' + count + ' intersection' + (count > 1 ? 's' : '') + ', that means it is' + (isOdd ? '' : ' not') + ' in ' + neighbourhood.properties[0].HOOD, isOdd);
                if (isOdd) {
                    hoods.push(neighbourhood.properties[0].HOOD);
                }
            }
        }

        if (hoods.length) {
            return hoods;
        }
        else {
            log('Neibourhood could not be detected', true);
            return false;
        }
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