import { Observable, defer, from } from "rxjs";
import { IEvents } from "../Model/eventData.model";

class EventService {
  public getEventData = (): Observable<IEvents[]> => {
    return defer(() =>
      // for lazy loading
      {
        return from<Promise<IEvents[]>>(
          fetch(
            // generic type coversion of promise to observable
            `/events`
          ).then(r => r.json())
        );
      }
    );
  };
}
export default new EventService();
