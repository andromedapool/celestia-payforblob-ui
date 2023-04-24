import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "./components/Modal";
import { EndPoint, PfbTx, ViewStatus, useEndpointsStore } from "./store/endpointsStore";

function App() {
  // State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [endpointUrl, setEndpointUrl] = useState<string>();

  // Store
  const { viewStatus, endpoints, add, remove, submit, errorMessage, reset, result } = useEndpointsStore();

  // React Form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PfbTx>();

  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    formState: { errors: errorsModal },
  } = useForm<EndPoint>();

  // Methods
  const onSubmit: SubmitHandler<PfbTx> = (data) => {
    if (endpointUrl) submit(data, endpointUrl);
    else {
      alert("> Please select an endpoint!");
    }
  };

  const onSubmitModal: SubmitHandler<EndPoint> = (data) => {
    add(data);
    setShowModal(false);
  };

  const onRemove = () => {
    if (endpointUrl) remove(endpointUrl);
    setEndpointUrl("");
  };

  // Effect
  useEffect(() => {
    reset();
  }, []);

  return (
    <div className="container bg-div">
      <Modal isActive={showModal} title="Add new endpoint" onCancel={() => setShowModal(false)}>
        <form onSubmit={handleSubmitModal(onSubmitModal)}>
          <div className="field">
            <label className="label">Endpoint name:</label>
            <div className="control">
              <input
                className={`input ${errorsModal.name && "is-danger"} `}
                type="text"
                placeholder="eg: Server 1"
                {...registerModal("name", { required: true })}
              />
            </div>
            {errorsModal.name && <p className="help is-danger">This field is required</p>}
          </div>
          <div className="field">
            <label className="label">Endpoint url:</label>
            <div className="control">
              <input
                className={`input ${errorsModal.url && "is-danger"} `}
                type="text"
                placeholder="eg: https://<your_ip_address>:26659/submit_pfb"
                {...registerModal("url", { required: true })}
              />
            </div>
            {errorsModal.url && <p className="help is-danger">This field is required</p>}
          </div>
          <div className="control">
            <button className={"button is-primary"}>Add</button>
          </div>
        </form>
      </Modal>

      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item mb-3" href="/">
            <img src="images/logo.png" alt="AndromedaPool" />
          </a>
        </div>
      </nav>

      <nav className="level">
        <div className="level-left">
          <div className="level-item">
            <div className="select">
              <select defaultValue={endpointUrl || ""} onChange={(e) => setEndpointUrl(e.currentTarget.value)}>
                <option value={""}>- Select endpoint -</option>
                <option value={"https://bridge-node-pfb.andromedapool.com/submit_pfb"}>AndromedaPool public endpoint</option>
                {endpoints.map((e, index) => (
                  <option key={index} value={e.url}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="level-item">
            {endpointUrl && !endpointUrl.includes("andromeda") && (
              <button className="button is-danger is-light mr-3" onClick={() => onRemove()}>
                Remove
              </button>
            )}
            <button className="button" onClick={() => setShowModal(true)}>
              Add your own
            </button>
          </div>
        </div>
      </nav>

      <div className="is-justify-content-center">
        <hr />
        {viewStatus === ViewStatus.Error && (
          <article className="message is-danger">
            <div className="message-header">
              <p>Error appeared. Try again</p>
            </div>
            <div className="message-body">{errorMessage}</div>
          </article>
        )}

        <div className="columns">
          <div className="column is-one-third">
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset disabled={viewStatus === ViewStatus.Loading}>
                {/* Form */}
                <div className="field">
                  <label className="label">Namespace ID:</label>
                  <div className="control">
                    <input
                      className={`input ${errors.namespaceId && "is-danger"} `}
                      type="text"
                      placeholder="eg: 8 bytes namespace ID"
                      {...register("namespaceId", { required: true })}
                    />
                  </div>
                  {errors.namespaceId && <p className="help is-danger">This field is required</p>}
                </div>

                <div className="field">
                  <label className="label">Data:</label>
                  <div className="control">
                    <input
                      className={`input ${errors.data && "is-danger"} `}
                      type="text"
                      placeholder="eg: hex-encoded message"
                      {...register("data", { required: true })}
                    />
                    {errors.data && <p className="help is-danger">This field is required</p>}
                  </div>
                </div>

                <div className="field is-grouped">
                  <div className="control">
                    <button className={`button is-primary ${viewStatus === ViewStatus.Loading && "is-loading"}`}>
                      Submit
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>

          {result && (
            <div className="column">
              <div className="div-json">
                <pre className="json">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
