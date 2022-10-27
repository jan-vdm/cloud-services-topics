import Head from 'next/head';
import { useWS } from '../components/ws.hook';

export default function Home() {
  const [lines, items] = useWS();

  return (
    <div className="container">
      <Head>
        <title>Monitor UI</title>
        <meta name="description" content="Made by Jan & Eden" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Monitor UI</h1>
        <div style={{ flex: 1, flexDirection: 'row', display: 'flex' }}>
          {lines
            .sort((a: any, b: any) => a.id - b.id)
            .map((line: any) => {
              return (
                <div key={line.id} style={{ flex: 1 }}>
                  <h2>Line {line.id}</h2>
                  {line.machines
                    .sort((a: any, b: any) => a.id - b.id)
                    .map((machine: any) => {
                      return (
                        <div key={machine.id} style={{ margin: 40 }}>
                          <h3>Machine {machine.id}</h3>
                          <div>State {machine.machineState}</div>
                          <h4>Queue:</h4>
                          {items
                            .filter(
                              (item: any) =>
                                item.lineId === line.id &&
                                item.machineId === machine.id,
                            )
                            .map((item: any) => {
                              return (
                                <div key={item.itemId}>
                                  <p style={{ fontWeight: 'bold' }}>
                                    Item {item.itemId}
                                  </p>
                                  <p>Queued at: {item.queuedAt}</p>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
