import getRequestList from './requestList';
import handlerList from './handlerList';

export default class BitrixBatch {
  constructor(BX24, isAdmin = false) {
    const instanceBatch = BX24.createBatch(handlerList);
    this.batch = instanceBatch.batch.bind(instanceBatch);
    this.isAdmin = isAdmin;
    this.requestList = getRequestList(isAdmin);
  }

  load() {
    return this.batch(this.requestList.initParams());
  }

  bind(placement, name) {
    if (this.isAdmin) {
      return this.batch(this.requestList.placementBind(placement, name))
        .then(({ placementList }) => placementList);
    }
    return Promise.resolve([]);
  }

  unbind(placement) {
    if (this.isAdmin) {
      return this.batch(this.requestList.placementUnbind(placement))
        .then(({ placementList }) => placementList);
    }
    return Promise.resolve([]);
  }
}
