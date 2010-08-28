function drawWorld(world, context, ox, oy) {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context, ox, oy);
		}
	}
}
function drawShape(shape, context, ox, oy) {
	context.strokeStyle = '#f00';
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
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(400 + v.x * 100, v.y * 100);
				theta += dtheta;
			}
			context.lineTo((pos.x + r) * 100, pos.y * 100);
	
			// draw radius
			context.moveTo(400 + pos.x * 100, pos.y * 100);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(400 + pos2.x * 100, pos2.y * 100);
		}
		break;
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(ox + tV.x, oy + tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {

				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				
				context.lineTo(ox + v.x, oy + v.y);
			}
			context.lineTo(ox + tV.x, oy + tV.y);
		}
		break;
	}
	context.stroke();
}

