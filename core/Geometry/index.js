import { ConeGeometry } from './Pro/ConeGeometry';
import { CubeGeometry } from './Pro/CubeGeometry'
import { CylinderGeometry } from './Pro/CylinderGeometry'
import { DodecahedronGeometry } from './Pro/DodecahedronGeometry'
import { EllipseGeometry } from './Pro/EllipseGeometry'
import { HelixGeometry } from './Pro/HelixGeometry'
import { IcosahedronGeometry } from './Pro/IcosahedronGeometry'
import { LatheGeometry } from './Pro/LatheGeometry'
import { NonParametricGeometry } from './Pro/NonParametricGeometry'
import { PolygonGeometry } from './Pro/PolygonGeometry'
import { PyramidGeometry } from './Pro/PyramidGeometry'
import { RectangleGeometry } from './Pro/RectangleGeometry'
import { SphereGeometry } from './Pro/SphereGeometry'
import { PlaneGeometry } from './Pro/PlaneGeometry'
import { StarGeometry } from './Pro/StarGeometry'
import { TextFrameGeometry } from './Pro/TextFrameGeometry'
import { TorusGeometry } from './Pro/TorusGeometry'
import { TorusKnotGeometry } from './Pro/TorusKnotGeometry'
import { TriangleGeometry } from './Pro/TriangleGeometry'
import { VectorGeometry } from './Pro/VectorGeometry'

export * from './Pro'

const GeometryPro = {
    ConeGeometry,
    CubeGeometry,
    CylinderGeometry,
    DodecahedronGeometry,
    EllipseGeometry,
    HelixGeometry,
    IcosahedronGeometry,
    LatheGeometry,
    NonParametricGeometry,
    PolygonGeometry,
    PyramidGeometry,
    RectangleGeometry,
    SphereGeometry,
    PlaneGeometry,
    StarGeometry,
    TextFrameGeometry,
    TorusGeometry,
    TorusKnotGeometry,
    TriangleGeometry,
    VectorGeometry
};
export const Geometries = GeometryPro;
export default i => GeometryPro[i.type].create(i);
