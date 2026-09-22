package com.margelo.nitro.camera.textrecognition.extensions

import android.graphics.Point as AndroidPoint
import android.graphics.Rect as AndroidRect
import com.margelo.nitro.camera.textrecognition.Point
import com.margelo.nitro.camera.textrecognition.Rect

fun AndroidRect?.toNitroRect(): Rect? {
  val rect = this ?: return null
  return Rect(rect.left.toDouble(), rect.right.toDouble(), rect.top.toDouble(), rect.bottom.toDouble())
}

fun Array<AndroidPoint>?.toNitroPoints(): Array<Point> =
  this?.map { Point(it.x.toDouble(), it.y.toDouble()) }?.toTypedArray() ?: emptyArray()
