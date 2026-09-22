import CoreGraphics

extension CGRect {
  var toNitroRect: Rect {
    return Rect(left: minX, right: maxX, top: minY, bottom: maxY)
  }
}

extension Array where Element == NSValue {
  var toNitroPoints: [Point] {
    return map { value in
      let point = value.cgPointValue
      return Point(x: point.x, y: point.y)
    }
  }
}
