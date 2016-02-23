import logging

from tornado.gen import coroutine, Return

from data.query import Query
from data.watch import add_callback, remove_callback


class UsersWatcher(object):

    def __init__(self, settings, callback):
        logging.info("Initializing UsersWatcher")

        self.settings = settings
        self.callback = callback
        self.message = None

    @coroutine
    def watch(self, message):
        logging.info("Starting watch Users")

        self.message = message

        users = yield Query(self.settings["database"], "Users").find()
        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=users
        ))

        add_callback("Users", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.info("UsersWatcher data_callback")
        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            status_code=200,
            body=document
        ))

        raise Return()

    def unwatch(self):
        logging.info("Stopping watch Users")
        remove_callback("elastickube.Users", self.data_callback)
        self.message = None
