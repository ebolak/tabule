"""
This is an example snap7 server. It doesn't do much, but accepts
connection. Useful for running the python-snap7 test suite.
"""
import time
import logging
import snap7
import sys


logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

tcpport = 1102

def mainloop():
    server = snap7.server.Server()
    size = 200
    DB21data = (snap7.snap7types.wordlen_to_ctypes[snap7.snap7types.S7WLByte] * size)()
    DB22data = (snap7.snap7types.wordlen_to_ctypes[snap7.snap7types.S7WLByte] * size)()
    DB23data = (snap7.snap7types.wordlen_to_ctypes[snap7.snap7types.S7WLByte] * size)()
    DB24data = (snap7.snap7types.wordlen_to_ctypes[snap7.snap7types.S7WLByte] * size)()
    DB25data = (snap7.snap7types.wordlen_to_ctypes[snap7.snap7types.S7WLByte] * size)()
    server.register_area(snap7.snap7types.srvAreaDB, 21, DB21data)
    server.register_area(snap7.snap7types.srvAreaDB, 22, DB22data)
    server.register_area(snap7.snap7types.srvAreaDB, 23, DB23data)
    server.register_area(snap7.snap7types.srvAreaDB, 24, DB24data)
    server.register_area(snap7.snap7types.srvAreaDB, 25, DB25data)

    server.start(tcpport=tcpport)
    while True:
        while True:
            event = server.pick_event()
            if event:
                logger.info(server.event_text(event))
            else:
                break
        time.sleep(1)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        snap7.common.load_library(sys.argv[1])
    mainloop()