from socketio import AsyncServer

sio: AsyncServer = AsyncServer(
    async_mode='asgi', 
    cors_allowed_origins='*'
)

@sio.on('ping')
async def darkglance(sid, data):
    return {
        'success': True,
        'message': 'pong',
        'data': data,
        'sid': sid
    }
    
    
__all__: list[str] = ['sio']