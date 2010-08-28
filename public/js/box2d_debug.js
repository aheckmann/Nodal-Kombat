function drawWorld(world, context, ox, oy, scale) {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context, ox, oy, scale);
		}
	}
}
function drawShape(shape, context, ox, oy, scale) {
	context.strokeStyle = '#000';
	context.lineWidth = 2;
	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// draw circle
			context.moveTo(ox + (pos.x + r) * scale, oy + pos.y * scale);
			//context.moveTo(ox, oy);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(ox + v.x * scale, oy + v.y * scale);
				theta += dtheta;
			}
			context.lineTo(ox + (pos.x + r) * scale, oy + pos.y * scale);
	
			// draw radius
			context.moveTo(ox + pos.x * scale, oy + pos.y * scale);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(ox + pos2.x * scale, oy + pos2.y * scale);
		}
		break;
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(ox + tV.x * scale, oy + tV.y * scale);
			for (var i = 0; i < poly.m_vertexCount; i++) {

				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				
				context.lineTo(ox + v.x * scale, oy + v.y * scale);
			}
			context.lineTo(ox + tV.x * scale, oy + tV.y * scale);
		}
		break;
	}
	context.stroke();
}

